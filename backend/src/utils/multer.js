const multer = require('multer');
const path = require('path');
const fs = require('fs');

function buildStorage() {
    return multer.diskStorage({
        destination: (req, file, cb) => {
            const productId = req.params.id || 'common';
            const uploadDir = path.join(__dirname, '..', '..', 'uploads', 'products', String(productId));
            fs.mkdirSync(uploadDir, { recursive: true });
            cb(null, uploadDir);
        },
        filename: (req, file, cb) => {
            const ext = path.extname(file.originalname);
            const name = path.basename(file.originalname, ext).replace(/\s+/g, '-');
            cb(null, `${Date.now()}-${name}${ext}`);
        }
    });
}

/**
 * uploadFields config example:
 * [{ name: 'avatar', maxCount: 1 }, { name: 'images', maxCount: 10 }]
 */
const uploadFields = (fields = [{ name: 'images', maxCount: 10 }]) => {
    const storage = buildStorage();
    const uploader = multer({ storage });
    return (req, res, next) => {
        uploader.fields(fields)(req, res, (err) => {
            if (err) return next(err);
            // normalize: ensure req.files exists
            req.files = req.files || {};
            next();
        });
    };
};

module.exports = { uploadFields };