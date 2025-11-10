const productImageService = require('../services/productimage.service');

const uploadImages = async (req, res) => {
    try {
        const productId = req.params.id;
        // multer.fields -> req.files is object: { avatar: [file], images: [file,...] }
        const filesObj = {};
        if (req.files) {
            if (req.files.avatar) filesObj.avatar = req.files.avatar;
            if (req.files.images) filesObj.images = req.files.images;
            // also accept 'images[]' field name
            if (req.files['images[]'] && !filesObj.images) filesObj.images = req.files['images[]'];
        }
        // fallback single file in req.file
        if (!Object.keys(filesObj).length && req.file) filesObj.images = [req.file];

        if ((!filesObj.images || filesObj.images.length === 0) && (!filesObj.avatar || filesObj.avatar.length === 0)) {
            return res.status(400).json({ error: 'No files uploaded' });
        }

        const created = await productImageService.uploadAvatarAndImages(productId, filesObj);
        return res.status(201).json({ uploaded: created });
    } catch (err) {
        console.error('Error uploading images:', err);
        return res.status(500).json({ error: 'Error uploading images' });
    }
};

const listImages = async (req, res) => {
    try {
        const productId = req.params.id;
        const images = await productImageService.getProductImages(productId);
        return res.json(images);
    } catch (err) {
        console.error('Error listing images:', err);
        return res.status(500).json({ error: 'Error listing images' });
    }
};

const deleteImage = async (req, res) => {
    try {
        const imageId = req.params.imageId;
        await productImageService.deleteProductImage(imageId);
        return res.status(204).send();
    } catch (err) {
        console.error('Error deleting image:', err);
        return res.status(400).json({ error: err.message || 'Error deleting image' });
    }
};

module.exports = {
    uploadImages,
    listImages,
    deleteImage
};