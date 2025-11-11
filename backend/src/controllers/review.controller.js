const reviewService = require('../services/review.service');

async function createReview(req, res) {
    try {
        const userId = req.user.id;
        const { productId, rating, comment, orderId } = req.body;
        if (!productId || !rating) {
            return res.status(400).json({ error: 'Missing required fields' });
        }

        const review = await reviewService.createReview(userId, { productId, rating, comment, orderId });
        return res.status(201).json(review);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
}

async function getReviewsByProduct(req, res) {
    try {
        const productId = req.params.productId;
        const reviews = await reviewService.getReviewByProduct(productId);
        res.status(200).json(reviews ?? []);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
}

async function getReviewsByUser(req, res) {
    try {
        const userId = req.user.id;
        const reviews = await reviewService.getReviewByUser(userId);
        res.status(200).json(reviews ?? []);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
}

async function updateReview(req, res) {
    try {
        const reviewId = req.params.reviewId;
        const userId = req.user.id;
        const review = await reviewService.updateReview(reviewId, userId, req.body);
        res.status(200).json(review);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
}

async function deleteReview(req, res) {
    try {
        const reviewId = req.params.reviewId;
        const userId = req.user.id;
        await reviewService.deleteReview(reviewId, userId);
        res.status(204).send();
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
}

async function getReviewStats(req, res) {
    try {
        const productId = req.params.productId;
        const stats = await reviewService.getReviewStats(productId);
        res.status(200).json(stats);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
}

async function getTopReviews(req, res) {
    try {
        const limit = Number.isInteger(parseInt(req.query.limit))
            ? parseInt(req.query.limit)
            : 5;
        const reviews = await reviewService.getTopReviews(limit);
        res.status(200).json(reviews);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
}

module.exports = {
    createReview,
    getReviewsByProduct,
    getReviewsByUser,
    updateReview,
    deleteReview,
    getReviewStats,
    getTopReviews,
};
