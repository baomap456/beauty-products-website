const db = require('../models');
const fs = require('fs');
const path = require('path');
const ProductImage = db.ProductImage;
const Product = db.Product; // ensure models/index exports Product

// helper: tìm tên attribute trong model (không phân biệt hoa thường)
function findAttr(model, candidates = []) {
    const attrs = Object.keys(model.rawAttributes || {});
    return attrs.find(a => candidates.some(c => a.toLowerCase() === String(c).toLowerCase()));
}

async function createProductImage(data) {
    return ProductImage.create(data);
}

/**
 * filesObj: { avatar?: [file], images?: [file, ...] }
 * - If Product model has a suitable avatar column (Image/Avatar/Thumbnail...), update product row.
 * - Always create ProductImage rows for images[].
 */
async function uploadAvatarAndImages(productId, filesObj = {}) {
    const created = { avatar: null, images: [] };

    // detect attributes
    const urlAttr = findAttr(ProductImage, ['url', 'URL', 'Url', 'path', 'filePath']) || 'URL';
    const productIdAttr = findAttr(ProductImage, ['product_id', 'Product_ID', 'ProductId', 'product']) || 'Product_ID';

    // handle avatar (single)
    if (filesObj.avatar && filesObj.avatar.length > 0) {
        const f = filesObj.avatar[0];
        const url = `/uploads/products/${productId}/${f.filename}`;

        // try to save into Product (common avatar columns)
        if (Product) {
            const avatarAttr = findAttr(Product, ['Image', 'image', 'Avatar', 'avatar', 'Thumbnail', 'thumbnail', 'ImageUrl', 'Image_URL']);
            if (avatarAttr) {
                const prod = await Product.findByPk(productId);
                if (prod) {
                    prod[avatarAttr] = url;
                    await prod.save();
                    created.avatar = { savedTo: 'Product', attr: avatarAttr, url };
                } else {
                    // fallback - create ProductImage row
                    const rec = await ProductImage.create({ [productIdAttr]: productId, [urlAttr]: url });
                    created.avatar = { savedTo: 'ProductImage', id: rec[ProductImage.primaryKeyAttribute || 'id'], url };
                }
            } else {
                // no avatar column on Product -> create ProductImage as fallback
                const rec = await ProductImage.create({ [productIdAttr]: productId, [urlAttr]: url });
                created.avatar = { savedTo: 'ProductImage', id: rec[ProductImage.primaryKeyAttribute || 'id'], url };
            }
        } else {
            const rec = await ProductImage.create({ [productIdAttr]: productId, [urlAttr]: url });
            created.avatar = { savedTo: 'ProductImage', id: rec[ProductImage.primaryKeyAttribute || 'id'], url };
        }
    }

    // handle images (many)
    if (filesObj.images && filesObj.images.length > 0) {
        for (const f of filesObj.images) {
            const url = `/uploads/products/${productId}/${f.filename}`;
            const rec = await ProductImage.create({ [productIdAttr]: productId, [urlAttr]: url });
            created.images.push(rec);
        }
    }

    return created;
}

async function getProductImages(productId) {
    // try common column names
    const where = {};
    const productIdAttr = findAttr(ProductImage, ['product_id', 'Product_ID', 'ProductId', 'product']) || 'Product_ID';
    where[productIdAttr] = productId;
    return ProductImage.findAll({ where, order: [['createdAt', 'ASC']] });
}

async function deleteProductImage(id) {
    const pk = ProductImage.primaryKeyAttribute || 'id';
    const img = await ProductImage.findOne({ where: { [pk]: id } });
    if (!img) throw new Error('Image not found');

    // delete file from disk if exists
    try {
        // img URL may start with /uploads
        const imgUrlAttr = findAttr(ProductImage, ['url', 'URL', 'Url', 'path', 'filePath']) || 'URL';
        const urlVal = img[imgUrlAttr] || img.Url || img.URL || img.url;
        if (urlVal) {
            // normalize to filesystem path
            const filePath = path.join(process.cwd(), urlVal.replace(/^\//, ''));
            if (fs.existsSync(filePath)) fs.unlinkSync(filePath);
        }
    } catch (err) {
        console.warn('deleteProductImage: file removal failed', err.message);
    }

    await img.destroy();
    return true;
}

module.exports = {
    createProductImage,
    uploadAvatarAndImages,
    getProductImages,
    deleteProductImage,
};