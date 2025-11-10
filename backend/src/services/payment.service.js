const db = require('../models');
const Payment = db.Payment;

async function createPayment(orderId, method, note = null) {
    try {
        const payment = await Payment.create({
            Order_ID: orderId,
            Method: method,
            Status: 'Unpaid',
            Note: note,
            PaymentDate: null
        });
        return payment;
    } catch (error) {
        throw new Error('Error creating payment: ' + error.message);
    }
}

async function getPaymentByOrderId(orderId) {
    try {
        const payment = await Payment.findOne({ where: { Order_ID: orderId } });
        return payment
    } catch (error) {
        throw new Error('Error retrieving payment: ' + error.message);
    }
}

async function updatePaymentStatus(orderId, status) {
    try {
        const payment = await Payment.findOne({ where: { Order_ID: orderId } });
        if (!payment) {
            throw new Error('Payment not found for Order_ID: ' + orderId);
        }
        payment.Status = status;
        if (status === 'Paid') {
            payment.PaymentDate = new Date();
        }
        await payment.save();
        return payment;
    } catch (error) {
        throw new Error('Error updating payment status: ' + error.message);
    }
}

async function getAllPayments({ page = 1, limit = 10, status, method }) {
    try {
        const where = {};
        if (status) where.Status = status;
        if (method) where.Method = method;

        const offset = (page - 1) * limit;
        const { count, rows } = await Payment.findAndCountAll({
            where,
            offset,
            limit,
            order: [['PaymentDate', 'DESC']],
        });
        return { count, rows };
    } catch (error) {
        throw new Error('Error retrieving payments: ' + error.message);
    }
}
module.exports = {
    createPayment,
    getPaymentByOrderId,
    updatePaymentStatus,
    getAllPayments
};