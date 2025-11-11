const { raw } = require('express');
const db = require('../models');
const Review = db.Review;

async function createReview(userId, data) {
    const order = await db.Order.findOne({
        where: { id: data.orderId, User_ID: userId, Status: 'completed' },
    });
    if (!order) {
        throw new Error('Order not found or not completed');
    }
    const review = await Review.create({ ...data, User_ID: userId });
    return review;

}

async function getReviewByProduct(productId) {
    const reviews = await Review.findAll({ where: { Product_ID: productId } });
    return reviews;
}


async function getReviewByUser(userId) {
    const reviews = await Review.findAll({ where: { User_ID: userId } });
    return reviews;
}

async function updateReview(reviewId, data) {
    const review = await Review.findByPk(reviewId);
    if (!review) {
        throw new Error('Review not found');
    }
    await review.update(data);
    return review;
}

async function deleteReview(reviewId) {
    const review = await Review.findByPk(reviewId);
    if (!review) {
        throw new Error('Review not found');
    }
    await review.destroy();
    return;
}

async function getAVGReviewByProduct(productId) {
    const result = await Review.findOne({
        attributes: [
            [db.Sequelize.fn('AVG', db.Sequelize.col('Rating')), 'avgRating'],
        ],
        where: { Product_ID: productId },
        raw: true,
    });

    // nếu không có review nào → avgRating = 0
    const avgValue = result?.avgRating ? parseFloat(result.avgRating) : 0;
    if (!avgValue) return 0;
    // làm tròn 1 chữ số thập phân, trả về kiểu number
    return Number(avgValue.toFixed(1));
}

async function getReviewStats(productId) {
    const totalReviews = await Review.count({ where: { productId } });
    const avgRating = await getAVGReviewByProduct(productId);
    return { productId, totalReviews, avgRating };
}

async function getTopReviews(limit = 5) {
    const reviews = await Review.findAll({
        attributes: [
            'Product_ID',
            [db.Sequelize.fn('AVG', db.Sequelize.col('Rating')), 'avgRating'],
            [db.Sequelize.fn('COUNT', db.Sequelize.col('ID_Review')), 'totalReviews']
        ],
        include: [{ model: db.Product, attributes: ['Name_Product'] }],
        group: ['Product_ID', 'Product.ID_Product'],
        order: [[db.Sequelize.literal('avgRating'), 'DESC']],
        limit,
        raw: true,
    });
    return reviews;
}

module.exports = {
    createReview,
    getReviewByProduct,
    getReviewByUser,
    updateReview,
    deleteReview,
    getAVGReviewByProduct,
    getReviewStats,
    getTopReviews,
};