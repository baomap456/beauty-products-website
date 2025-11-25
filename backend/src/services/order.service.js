const db = require('../models');
const sequelize = db.sequelize;

const Order = db.Order;
const OrderDetail = db.OrderDetail;
const Cart = db.Cart;
const CartItem = db.CartItem;
const Payment = db.Payment || null;
const Address = db.Address || null;
const Discount = db.Discount || null;
const Product = db.Product;

/**
 * Helpers
 */
function createError(message, code = 'ERROR', status = 400) {
    const err = new Error(message);
    err.code = code;
    err.status = status;
    return err;
}

function toNumber(v) {
    return Number(v ?? 0);
}

function calcTotalFromItems(items = []) {
    return items.reduce((sum, it) => {
        const price = toNumber(it.Price ?? it.price ?? it.dataValues?.Price ?? 0);
        const qty = toNumber(it.Quantity ?? it.quantity ?? it.dataValues?.Quantity ?? 0);
        return sum + price * qty;
    }, 0);
}

async function fetchActiveCartForUser(userId, cartId = null, transaction = null) {
    if (cartId) {
        return Cart.findByPk(cartId, { transaction });
    }
    return Cart.findOne({ where: { User_ID: userId, Status: 'active' }, transaction });
}

async function ensureCartAndOwnership(userId, cart, transaction = null) {
    if (!cart) throw createError('Cart not found', 'CART_NOT_FOUND', 404);
    if (String(cart.User_ID) !== String(userId)) throw createError('Unauthorized', 'UNAUTHORIZED', 401);

    const items = await CartItem.findAll({
        where: { Cart_ID: cart.ID_Cart },
        transaction
    });

    if (!items || items.length === 0) throw createError('Cart is empty', 'CART_EMPTY', 400);
    return items;
}

/**
 * Validate discount (flexible checks). Returns discount record or null.
 */
async function validateDiscount(discountId, totalAmount = 0, transaction = null) {
    if (!discountId || !Discount) return null;

    const discount = await Discount.findByPk(discountId, { transaction });
    if (!discount) throw createError('Discount not found', 'DISCOUNT_NOT_FOUND', 404);

    // flexible checks: expire / active / min total
    const isActive =
        (discount.IsActive ?? discount.isActive ?? discount.Active ?? discount.Status ?? 'active') !== false;

    if (!isActive) throw createError('Discount is not active', 'DISCOUNT_INACTIVE', 400);

    // check expiry fields if present
    const expiry = discount.ExpiresAt ?? discount.Expiry ?? discount.expiredAt ?? discount.ExpirationDate ?? discount.ExpireDate;
    if (expiry) {
        const expiryDate = new Date(expiry);
        if (!Number.isNaN(expiryDate.getTime()) && expiryDate < new Date()) {
            throw createError('Discount has expired', 'DISCOUNT_EXPIRED', 400);
        }
    }

    // check minimum amount if present
    const minTotal = toNumber(discount.MinAmount ?? discount.Min_Total ?? discount.minAmount ?? discount.minimum);
    if (minTotal && totalAmount < minTotal) {
        throw createError('Cart total does not meet discount minimum', 'DISCOUNT_MIN_TOTAL', 400);
    }

    return discount;
}

/**
 * Create order from cart (fully transactional).
 * - creates Order
 * - creates OrderDetails (Promise.all)
 * - optional: create Payment
 * - update Cart (status) and clear items
 */
async function createOrderFromCart(userId, { cartId = null, addressId = null, discountId = null, paymentPayload = null } = {}) {
    return sequelize.transaction(async (t) => {
        // fetch cart and validate ownership
        const cart = await fetchActiveCartForUser(userId, cartId, t);
        const items = await ensureCartAndOwnership(userId, cart, t);

        // calculate total
        const totalAmount = calcTotalFromItems(items);

        // validate discount if provided
        const discount = discountId ? await validateDiscount(discountId, totalAmount, t) : null;

        // optionally adjust totalAmount based on discount (basic support)
        let finalTotal = totalAmount;
        if (discount) {
            const percent = toNumber(discount.Percentage ?? discount.percent ?? discount.Value ?? 0);
            if (percent > 0 && percent <= 100) {
                finalTotal = finalTotal - (finalTotal * (percent / 100));
            } else {
                const flat = toNumber(discount.Amount ?? discount.amount ?? discount.Value ?? 0);
                if (flat > 0) finalTotal = Math.max(0, finalTotal - flat);
            }
        }

        // create order
        const orderPayload = {
            User_ID: userId,
            Address_ID: addressId ?? null,
            Discount_ID: discountId ?? null,
            Total_Amount: finalTotal,
            Status: 'Pending'
        };

        const order = await Order.create(orderPayload, { transaction: t });

        // create order details in parallel (Promise.all)
        const detailCreates = items.map((it) => {
            const detailPayload = {
                Order_ID: order.ID_Order,
                Product_ID: it.Product_ID,
                Quantity: it.Quantity,
                Price: it.Price
            };
            return OrderDetail.create(detailPayload, { transaction: t });
        });
        await Promise.all(detailCreates);

        // handle payment creation/update if paymentPayload exists
        if (paymentPayload && Payment) {
            const paymentData = Object.assign({ Order_ID: order.ID_Order, Status: paymentPayload.Status ?? 'Pending' }, paymentPayload);
            await Payment.create(paymentData, { transaction: t });
            if ((paymentPayload.Status ?? '').toLowerCase() === 'paid') {
                await order.update({ Status: 'Processing' }, { transaction: t });
            }
        }

        // mark cart ordered and clear items
        await cart.update({ Status: 'ordered' }, { transaction: t });
        await CartItem.destroy({ where: { Cart_ID: cart.ID_Cart }, transaction: t });

        // return order with details (include OrderDetail + Product)
        const orderResult = await Order.findByPk(order.ID_Order, {
            include: [
                {
                    model: OrderDetail,
                    as: 'OrderDetails',
                    required: false,
                    include: [{ model: Product, as: 'Product', required: false }]
                }
            ],
            transaction: t
        });

        return orderResult;
    }).catch((err) => {
        console.error({ action: 'createOrderFromCart', userId, cartId, error: err && err.message ? err.message : err });
        throw err.code ? err : createError('Failed to create order', 'ORDER_CREATE_FAILED', 500);
    });
}

/**
 * Get all orders with pagination and includes
 */
async function getAllOrders({ page = 1, limit = 20 } = {}) {
    try {
        const offset = (Math.max(1, page) - 1) * limit;
        const result = await Order.findAndCountAll({
            include: [
                {
                    model: OrderDetail,
                    as: 'orderDetails',
                    required: false,
                    include: [{ model: Product, as: 'product', required: false }]
                }
            ],
            order: [['createdAt', 'DESC']],
            limit,
            offset
        });

        return {
            rows: result.rows,
            count: result.count,
            page: Math.max(1, page),
            limit
        };
    } catch (err) {
        console.error({ action: 'getAllOrders', err });
        throw createError('Failed to fetch orders', 'ORDER_FETCH_FAILED', 500);
    }
}

/**
 * Get orders for a user with pagination
 */
async function getOrdersByUser(userId, { page = 1, limit = 20 } = {}) {
    try {
        const offset = (Math.max(1, page) - 1) * limit;
        const result = await Order.findAndCountAll({
            where: { User_ID: userId },
            include: [
                {
                    model: OrderDetail,
                    as: 'orderDetails',
                    required: false,
                    include: [{ model: Product, as: 'product', required: false }]
                }
            ],
            order: [['createdAt', 'DESC']],
            limit,
            offset
        });

        return {
            rows: result.rows,
            count: result.count,
            page: Math.max(1, page),
            limit
        };
    } catch (err) {
        console.error({ action: 'getOrdersByUser', userId, err });
        throw createError('Failed to fetch user orders', 'ORDER_USER_FETCH_FAILED', 500);
    }
}

/**
 * Get single order details (ensures ownership)
 */
async function getOrderById(userId, orderId) {
    try {
        const order = await Order.findByPk(orderId, {
            include: [
                {
                    model: OrderDetail,
                    as: 'OrderDetails',
                    required: false,
                    include: [{ model: Product, as: 'product', required: false }]
                },
                ...(Payment ? [{ model: Payment, as: 'payments', required: false }] : []),
                ...(Address ? [{ model: Address, as: 'address', required: false }] : [])
            ]
        });

        if (!order) throw createError('Order not found', 'ORDER_NOT_FOUND', 404);
        if (String(order.User_ID) !== String(userId)) throw createError('Unauthorized', 'UNAUTHORIZED', 401);

        return order;
    } catch (err) {
        console.error({ action: 'getOrderById', userId, orderId, err });
        throw err.code ? err : createError('Failed to fetch order', 'ORDER_FETCH_BY_ID_FAILED', 500);
    }
}

/**
 * Update order status (transactional if payment updates required)
 */
async function updateOrder(orderId, status, { updatePayment = false } = {}) {
    return sequelize.transaction(async (t) => {
        const order = await Order.findByPk(orderId, { transaction: t });
        if (!order) throw createError('Order not found', 'ORDER_NOT_FOUND', 404);

        if (['Completed', 'Cancelled'].includes(order.Status)) {
            throw createError('Cannot update completed or cancelled orders', 'ORDER_INVALID_STATE', 400);
        }

        // if moving to Completed, update related payment if requested
        if (status === 'Completed' && Payment && updatePayment) {
            await Payment.update({ Status: 'Paid' }, { where: { Order_ID: orderId }, transaction: t });
        }

        const updated = await order.update({ Status: status }, { transaction: t });
        return updated;
    }).catch((err) => {
        console.error({ action: 'updateOrder', orderId, status, err });
        throw err.code ? err : createError('Failed to update order', 'ORDER_UPDATE_FAILED', 500);
    });
}

/**
 * Cancel order (transactional) - may update payment status
 */
async function cancelOrder(orderId, { refundPayment = false } = {}) {
    return sequelize.transaction(async (t) => {
        const order = await Order.findByPk(orderId, { transaction: t });
        if (!order) throw createError('Order not found', 'ORDER_NOT_FOUND', 404);

        if (!['Pending', 'Processing'].includes(order.Status)) {
            throw createError('Cannot cancel completed or already cancelled orders', 'ORDER_CANNOT_CANCEL', 400);
        }

        // update payment if exists and refundPayment requested
        if (Payment && refundPayment) {
            await Payment.update({ Status: 'Refunded' }, { where: { Order_ID: orderId }, transaction: t });
        }

        const cancelled = await order.update({ Status: 'Cancelled' }, { transaction: t });
        return cancelled;
    }).catch((err) => {
        console.error({ action: 'cancelOrder', orderId, err });
        throw err.code ? err : createError('Failed to cancel order', 'ORDER_CANCEL_FAILED', 500);
    });
}

/**
 * Admin helpers
 */
async function getOrderDetails(orderId) {
    try {
        return Order.findByPk(orderId, {
            include: [
                {
                    model: OrderDetail,
                    as: 'OrderDetails',
                    required: false,
                    include: [{ model: Product, as: 'Product', required: false }]
                },
                ...(Payment ? [{ model: Payment, as: 'Payments', required: false }] : []),
                ...(Address ? [{ model: Address, as: 'Address', required: false }] : []),
                ...(Discount ? [{ model: Discount, as: 'Discount', required: false }] : [])
            ]
        });
    } catch (err) {
        console.error({ action: 'getOrderDetails', orderId, err });
        throw createError('Failed to fetch order details', 'ORDER_DETAIL_FETCH_FAILED', 500);
    }
}

module.exports = {
    createOrderFromCart,
    getAllOrders,
    getOrdersByUser,
    getOrderById,
    getOrderDetails,
    updateOrder,
    cancelOrder
};