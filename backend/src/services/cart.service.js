const db = require('../models');
const { Op } = require('sequelize');

const Cart = db.Cart;
const CartItem = db.CartItem;
const Product = db.Product;
const sequelize = db.sequelize;

function createError(message, status = 400, code = 'ERROR') {
    const err = new Error(message);
    err.status = status;
    err.code = code;
    return err;
}

function findAttr(model, candidates = []) {
    if (!model || !model.rawAttributes) return null;
    const attrs = Object.keys(model.rawAttributes);
    return attrs.find(a => candidates.some(c => a.toLowerCase() === String(c).toLowerCase()));
}

function calculateTotalFromItems(items = []) {
    return items.reduce((sum, it) => {
        const price = Number(it.Price ?? it.price ?? it.dataValues?.Price ?? 0);
        const qty = Number(it.Quantity ?? it.quantity ?? it.dataValues?.Quantity ?? 0);
        return sum + price * qty;
    }, 0);
}

function formatCartResponse(cart) {
    if (!cart) return { items: [], Total: 0 };

    const flatItems = (cart.items || []).map(item => {
        const product = item.product || {};
        return {
            ID_CartItem: item.ID_CartItem,
            Quantity: item.Quantity,
            // Thông tin Product được lôi ra ngoài
            ID_Product: item.Product_ID,
            Name_Product: product.Name_Product,
            Price: parseFloat(product.Price || 0), // Đảm bảo là số
            Stock: product.Stock,
            Image: product.mainImage || product.Image || '', // Xử lý ảnh

            // Giữ lại object gốc nếu cần (optional)
            // product: product 
        };
    });

    return {
        ID_Cart: cart.ID_Cart,
        Total: parseFloat(cart.Total || 0),
        items: flatItems
    };
}

async function getOrCreateCartForUser(userId, t = null) {
    try {
        const cart = await Cart.findOne({
            where: { User_ID: userId, Status: 'active' },
            include: [{ model: CartItem, as: 'items' }],
            transaction: t
        });
        if (cart) return cart;
        return await Cart.create({ User_ID: userId, Status: 'active', Total: 0 }, { transaction: t });
    } catch (err) {
        console.error({ action: 'getOrCreateCartForUser', userId, err });
        throw createError('Failed to get or create cart', 500, 'CART_CREATE_FAILED');
    }
}

async function getCartByUser(userId) {
    try {
        const cart = await Cart.findOne({
            where: { User_ID: userId, Status: 'active' },
            include: [{ model: CartItem, as: 'items', include: [{ model: Product, as: 'product' }] }]
        });
        return formatCartResponse(cart);
    } catch (err) {
        console.error({ action: 'getCartByUser', userId, err });
        throw createError('Failed to fetch cart', 500, 'CART_FETCH_FAILED');
    }
}

/**
 * Add item to cart
 */
async function addItemToCart(userId, productId, quantity = 1) {
    if (!Number.isInteger(quantity) || quantity <= 0) {
        throw createError('Quantity must be a positive integer', 400, 'INVALID_QUANTITY');
    }

    return sequelize.transaction(async (t) => {
        try {
            const cart = await getOrCreateCartForUser(userId, t);

            const product = await Product.findByPk(productId, { transaction: t });
            if (!product) throw createError('Product not found', 404, 'PRODUCT_NOT_FOUND');

            // detect price field
            const priceAttr = findAttr(Product, ['Price', 'price', 'UnitPrice', 'unit_price']) || 'Price';
            const price = Number(product[priceAttr] ?? product.Price ?? 0);

            // find or create CartItem
            const cartPk = Cart.primaryKeyAttribute || 'ID_Cart';
            const cartIdVal = cart[cartPk] || cart.ID_Cart;
            let item = await CartItem.findOne({ where: { Cart_ID: cartIdVal, Product_ID: productId }, transaction: t });

            if (item) {
                item.Quantity = Number(item.Quantity) + Number(quantity);
                item.Price = price;
                await item.save({ transaction: t });
            } else {
                item = await CartItem.create({
                    Cart_ID: cartIdVal,
                    Product_ID: productId,
                    Quantity: quantity,
                    Price: price
                }, { transaction: t });
            }

            // recalc total using helper
            const items = await CartItem.findAll({ where: { Cart_ID: cartIdVal }, transaction: t });
            const total = calculateTotalFromItems(items);
            cart.Total = total;
            await cart.save({ transaction: t });

            return formatCartResponse({ cart, item });
        } catch (err) {
            console.error({ action: 'addItemToCart', userId, productId, quantity, err });
            throw err.code ? err : createError('Failed to add item to cart', 500, 'CART_ADD_FAILED');
        }
    });
}


async function updateCartItem(userId, cartItemId, quantity) {
    if (!Number.isInteger(quantity) || quantity < 0) {
        throw createError('Quantity must be a non-negative integer', 400, 'INVALID_QUANTITY');
    }
    if (quantity === 0) {
        return removeCartItem(userId, cartItemId);
    }

    return sequelize.transaction(async (t) => {
        try {
            const item = await CartItem.findByPk(cartItemId, { transaction: t });
            if (!item) throw createError('Cart item not found', 404, 'CART_ITEM_NOT_FOUND');

            const cart = await Cart.findByPk(item.Cart_ID, { transaction: t });
            if (!cart) throw createError('Cart not found', 404, 'CART_NOT_FOUND');
            if (String(cart.User_ID) !== String(userId)) throw createError('Unauthorized', 401, 'UNAUTHORIZED');

            item.Quantity = quantity;
            await item.save({ transaction: t });

            const items = await CartItem.findAll({ where: { Cart_ID: cart.ID_Cart }, transaction: t });
            const total = calculateTotalFromItems(items);
            cart.Total = total;
            await cart.save({ transaction: t });

            return formatCartResponse({ cart, item });
        } catch (err) {
            console.error({ action: 'updateCartItem', userId, cartItemId, quantity, err });
            throw err.code ? err : createError('Failed to update cart item', 500, 'CART_UPDATE_FAILED');
        }
    });
}

async function removeCartItem(userId, cartItemId) {
    return sequelize.transaction(async (t) => {
        try {
            const item = await CartItem.findByPk(cartItemId, { transaction: t });
            if (!item) throw createError('Cart item not found', 404, 'CART_ITEM_NOT_FOUND');

            const cart = await Cart.findByPk(item.Cart_ID, { transaction: t });
            if (!cart) throw createError('Cart not found', 404, 'CART_NOT_FOUND');
            if (String(cart.User_ID) !== String(userId)) throw createError('Unauthorized', 401, 'UNAUTHORIZED');

            await item.destroy({ transaction: t });

            const items = await CartItem.findAll({ where: { Cart_ID: cart.ID_Cart }, transaction: t });
            const total = calculateTotalFromItems(items);
            cart.Total = total;
            await cart.save({ transaction: t });

            return { cart };
        } catch (err) {
            console.error({ action: 'removeCartItem', userId, cartItemId, err });
            throw err.code ? err : createError('Failed to remove cart item', 500, 'CART_REMOVE_FAILED');
        }
    });
}

async function clearCart(userId) {
    return sequelize.transaction(async (t) => {
        try {
            const cart = await Cart.findOne({ where: { User_ID: userId, Status: 'active' }, transaction: t });
            if (!cart) return null;
            await CartItem.destroy({ where: { Cart_ID: cart.ID_Cart }, transaction: t });
            cart.Total = 0;
            await cart.save({ transaction: t });
            return cart;
        } catch (err) {
            console.error({ action: 'clearCart', userId, err });
            throw createError('Failed to clear cart', 500, 'CART_CLEAR_FAILED');
        }
    });
}

async function mergeCarts(userId, localItems = []) {
    if (!Array.isArray(localItems) || localItems.length === 0) {
        return getCartByUser(userId);
    }
    try {
        return sequelize.transaction(async (t) => {
            const cart = await getOrCreateCartForUser(userId, t);
            const cartPk = Cart.primaryKeyAttribute || 'ID_Cart';
            const cartIdVal = cart[cartPk] || cart.ID_Cart;

            for (const localItem of localItems) {
                const { Product_ID, Quantity } = localItem;

                const product = await Product.findByPk(Product_ID, { transaction: t });
                const productPrice = product.Price;
                if (!product) continue;

                let item = await CartItem.findOne({ where: { Cart_ID: cartIdVal, Product_ID }, transaction: t });

                if (item) {
                    item.Quantity = Number(item.Quantity) + Number(Quantity);
                    await item.save({ transaction: t });
                }
                else {
                    await CartItem.create({
                        Cart_ID: cartIdVal,
                        Product_ID,
                        Quantity,
                        Price: productPrice
                    }, { transaction: t });
                }
            }
            const items = await CartItem.findAll({ where: { Cart_ID: cartIdVal }, transaction: t });
            const total = calculateTotalFromItems(items);
            cart.Total = total;
            await cart.save({ transaction: t });
            return formatCartResponse(await Cart.findOne({
                where: { ID_Cart: cartIdVal },
                include: [{ model: CartItem, as: 'items', include: [{ model: Product, as: 'product' }] }],
                transaction: t
            }))
        });
    }
    catch (err) {
        console.error({ action: 'mergeCarts', userId, err });
        throw createError('Failed to merge carts', 500, 'CART_MERGE_FAILED');
    }

}


module.exports = {
    getOrCreateCartForUser,
    getCartByUser,
    addItemToCart,
    updateCartItem,
    removeCartItem,
    clearCart,
    mergeCarts
};