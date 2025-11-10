const paymentService = require('../services/payment.service');

const createPayment = async (req, res) => {
    try {
        const { orderId, method, note } = req.body;
        if (!orderId || !method) {
            return res.status(400).json({ message: 'Thiếu thông tin bắt buộc' });
        }
        const payment = await paymentService.createPayment(orderId, method, note);

        res.status(201).json({
            message: 'Tạo thanh toán thành công!',
            payment,
        });
    } catch (error) {
        res.status(400).json({
            message: error.message || 'Tạo thanh toán thất bại',
        });
    }
};

const getPaymentByOrderId = async (req, res) => {
    try {
        const { orderId } = req.params;
        const payment = await paymentService.getPaymentByOrderId(orderId);
        if (!payment) {
            return res.status(404).json({ message: 'Không tìm thấy thanh toán' });
        }
        res.status(200).json(payment);
    } catch (error) {
        res.status(400).json({
            message: error.message || 'Lấy thông tin thanh toán thất bại',
        });
    }
};

const updatePaymentStatus = async (req, res) => {
    try {
        const { orderId } = req.params;
        const { status } = req.body;
        if (!status) {
            return res.status(400).json({ message: 'Thiếu trạng thái thanh toán' });
        }
        const updatedPayment = await paymentService.updatePaymentStatus(orderId, status);

        res.status(200).json({
            message: 'Cập nhật trạng thái thanh toán thành công!',
            payment: updatedPayment,
        });
    } catch (error) {
        res.status(400).json({
            message: error.message || 'Cập nhật trạng thái thanh toán thất bại',
        });
    }
};

const getAllPayments = async (req, res) => {
    try {
        const { page, limit, status, method } = req.query;
        const pageNum = parseInt(page) || 1;
        const limitNum = parseInt(limit) || 10;
        const { count, rows } = await paymentService.getAllPayments({ page: pageNum, limit: limitNum, status, method });
        res.status(200).json({
            message: 'Lấy danh sách thanh toán thành công!',
            total: count,
            payments: rows
        });
    } catch (error) {
        res.status(400).json({
            message: error.message || 'Lấy danh sách thanh toán thất bại',
        });
    }
};

module.exports = {
    createPayment,
    getPaymentByOrderId,
    updatePaymentStatus,
    getAllPayments,
};