const orderService = require('../services/order.service');

function getUserIdFromReq(req) {
    const u = req.user || {};
    return u.sub || u.id || u.ID_User || u.User_ID || u.userId || null;
}

const checkout = async (req, res) => {
    try {
        const userId = getUserIdFromReq(req);
        if (!userId) return res.status(401).json({ message: 'Unauthorized' });

        const { cartId, addressId, discountId } = req.body;
        const order = await orderService.createOrderFromCart(userId, { cartId, addressId, discountId });
        return res.status(201).json(order);
    } catch (err) {
        console.error(err);
        return res.status(400).json({ message: err.message || 'Error creating order' });
    }
};

const myOrders = async (req, res) => {
    try {
        const userId = getUserIdFromReq(req);
        if (!userId) return res.status(401).json({ message: 'Unauthorized' });

        const orders = await orderService.getOrdersByUser(userId);
        return res.json(orders);
    } catch (err) {
        console.error(err);
        return res.status(500).json({ message: err.message || 'Server error' });
    }
};

const getOrderByUser = async (req, res) => {
    try {
        const userId = getUserIdFromReq(req);
        if (!userId) return res.status(401).json({ message: 'Unauthorized' });

        const orderId = req.params.id;
        const order = await orderService.getOrderById(userId, orderId);
        return res.json(order);
    } catch (err) {
        console.error(err);
        return res.status(400).json({ message: err.message || 'Error fetching order' });
    }
};

const listOrders = async (req, res) => {
    try {
        const page = parseInt(req.query.page || '1', 10);
        const limit = parseInt(req.query.limit || '20', 10);
        const result = await orderService.getAllOrders({ page, limit });
        return res.json(result);
    } catch (err) {
        console.error('admin.listOrders error', err);
        return res.status(err?.status || 500).json({ error: err?.message || 'Failed to list orders' });
    }
};

const getOrderByAdmin = async (req, res) => {
    try {
        const orderId = req.params.id;
        const order = await orderService.getOrderDetails(orderId);
        if (!order) return res.status(404).json({ error: 'Order not found' });
        return res.json(order);
    } catch (err) {
        console.error('admin.getOrder error', err);
        return res.status(err?.status || 500).json({ error: err?.message || 'Failed to fetch order' });
    }
};

const updateOrderStatusByAdmin = async (req, res) => {
    try {
        const orderId = req.params.id;
        const { status, updatePayment = false } = req.body;
        if (!status) return res.status(400).json({ error: 'Missing status' });
        const updated = await orderService.updateOrder(orderId, status, { updatePayment });
        return res.json(updated);
    } catch (err) {
        console.error('admin.updateOrderStatus error', err);
        return res.status(err?.status || 500).json({ error: err?.message || 'Failed to update order' });
    }
};

const cancelOrderByAdmin = async (req, res) => {
    try {
        const orderId = req.params.id;
        const { refundPayment = false } = req.body || {};
        const cancelled = await orderService.cancelOrder(orderId, { refundPayment });
        return res.json(cancelled);
    } catch (err) {
        console.error('admin.cancelOrder error', err);
        return res.status(err?.status || 500).json({ error: err?.message || 'Failed to cancel order' });
    }
};


module.exports = {
    checkout,
    myOrders,
    listOrders,
    getOrderByUser,
    getOrderByAdmin,
    updateOrderStatusByAdmin,
    cancelOrderByAdmin
};
