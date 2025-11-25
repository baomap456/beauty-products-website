const cartService = require('../services/cart.service');

// Helper: Lấy User ID an toàn
function getUserIdFromReq(req) {
    const u = req.user || {};
    return u.sub || u.id || u.ID_User || u.User_ID || u.userId || null;
}

// Helper: Xử lý lỗi chung (Lấy status từ Service nếu có)
function handleError(res, err, defaultMsg = 'Server error') {
    console.error(err);
    // Nếu service có ném ra err.status (ví dụ 404, 401) thì dùng, nếu không thì 500
    const status = err.status || 500;
    return res.status(status).json({
        message: err.message || defaultMsg,
        code: err.code || 'INTERNAL_ERROR'
    });
}

// 1. Lấy giỏ hàng
const getMyCart = async (req, res) => {
    try {
        const userId = getUserIdFromReq(req);
        if (!userId) return res.status(401).json({ message: 'Unauthorized' });

        const cart = await cartService.getCartByUser(userId);
        // Luôn trả về cấu trúc { items: [], Total: 0 } nếu chưa có cart
        return res.json(cart || { items: [], Total: 0 });
    } catch (err) {
        return handleError(res, err, 'Error fetching cart');
    }
};

// 2. Thêm vào giỏ
const addItem = async (req, res) => {
    try {
        const userId = getUserIdFromReq(req);
        if (!userId) return res.status(401).json({ message: 'Unauthorized' });

        const { productId, quantity } = req.body;
        if (!productId) return res.status(400).json({ message: 'productId required' });

        const result = await cartService.addItemToCart(userId, productId, Number(quantity || 1));
        return res.status(201).json(result);
    } catch (err) {
        return handleError(res, err, 'Error adding item');
    }
};

// 3. Cập nhật số lượng
const updateItem = async (req, res) => {
    try {
        const userId = getUserIdFromReq(req);
        if (!userId) return res.status(401).json({ message: 'Unauthorized' });

        const cartItemId = req.params.itemId;
        const { quantity } = req.body;

        if (!cartItemId) return res.status(400).json({ message: 'itemId required' });

        const result = await cartService.updateCartItem(userId, cartItemId, Number(quantity));
        return res.json(result);
    } catch (err) {
        return handleError(res, err, 'Error updating item');
    }
};

// 4. Xóa item
const removeItem = async (req, res) => {
    try {
        const userId = getUserIdFromReq(req);
        if (!userId) return res.status(401).json({ message: 'Unauthorized' });

        const cartItemId = req.params.itemId;
        if (!cartItemId) return res.status(400).json({ message: 'itemId required' });

        const result = await cartService.removeCartItem(userId, cartItemId);

        // Thay đổi: Trả về giỏ hàng mới nhất thay vì 204 để FE cập nhật luôn
        return res.json(result);
    } catch (err) {
        return handleError(res, err, 'Error removing item');
    }
};

// 5. Xóa sạch giỏ hàng
const clear = async (req, res) => {
    try {
        const userId = getUserIdFromReq(req);
        if (!userId) return res.status(401).json({ message: 'Unauthorized' });

        const cart = await cartService.clearCart(userId);
        return res.json(cart || { items: [], Total: 0 });
    } catch (err) {
        return handleError(res, err, 'Error clearing cart');
    }
};

// 6. [MỚI] Gộp giỏ hàng (Merge Cart)
const mergeCart = async (req, res) => {
    try {
        const userId = getUserIdFromReq(req);
        if (!userId) return res.status(401).json({ message: 'Unauthorized' });

        // FE gửi lên body dạng: { items: [ { productId: 1, quantity: 2 }, ... ] }
        const { items } = req.body;

        if (!Array.isArray(items)) {
            return res.status(400).json({ message: 'items must be an array' });
        }

        const cart = await cartService.mergeCarts(userId, items);
        return res.json(cart);
    } catch (err) {
        return handleError(res, err, 'Error merging cart');
    }
};

module.exports = {
    getMyCart,
    addItem,
    updateItem,
    removeItem,
    clear,
    mergeCart // <-- Đừng quên export
};