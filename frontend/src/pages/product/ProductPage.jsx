import { useState, useEffect } from 'react';
import ProductList from '../../components/product/ProductList';
import ProductForm from '../../components/product/ProductForm';
import { getProducts, createProduct, updateProduct, deleteProduct, uploadImages } from '../../api/product';
import {
    Box,
    Button,
    Container,
    Typography,
    CircularProgress,
    Alert,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    Snackbar,
    Toolbar
} from '@mui/material';

const ProductPage = () => {
    //API 
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    // Dialog add/edit
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [productToEdit, setProductToEdit] = useState(null);

    // Confirm delete
    const [confirmOpen, setConfirmOpen] = useState(false);
    const [productToDelete, setProductToDelete] = useState(null);

    // Snackbar
    const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });

    const openSnackbar = (message, severity = 'success') =>
        setSnackbar({ open: true, message, severity });
    const closeSnackbar = () => setSnackbar((s) => ({ ...s, open: false }));

    const handleOpenDialog = () => setIsDialogOpen(true);
    const handleCloseDialog = () => {
        setIsDialogOpen(false);
        setProductToEdit(null);
    };

    const handleEdit = (product) => {
        setProductToEdit(product);
        setIsDialogOpen(true);
    };

    const handleDeleteRequest = (product) => {
        setProductToDelete(product);
        setConfirmOpen(true);
    };

    const handleConfirmDelete = async () => {
        if (!productToDelete) return;
        try {
            await deleteProduct(productToDelete.id);
            const data = await getProducts();
            setProducts(data);
            openSnackbar('Deleted product successfully');
        } catch (err) {
            console.error(err);
            openSnackbar(err?.message || 'Delete failed', 'error');
        } finally {
            setConfirmOpen(false);
            setProductToDelete(null);
        }
    };

    const handleSubmitProduct = async (formdata, mainImage, secondaryImage) => {
        try {
            const imageFormData = new FormData();
            if (mainImage) imageFormData.append('mainImage', mainImage);
            (secondaryImage || []).forEach((image) => imageFormData.append('secondaryImage', image));

            const resultUpload = await uploadImages(productToEdit ? productToEdit.id : 'new', imageFormData);
            const productData = {
                ...formdata,
                mainImage: resultUpload.mainImageUrl,
                secondaryImage: resultUpload.secondaryImageUrls
            };

            if (productToEdit) {
                await updateProduct(productToEdit.id, productData);
                openSnackbar('Updated product successfully');
            } else {
                await createProduct(productData);
                openSnackbar('Created product successfully');
            }

            const data = await getProducts();
            setProducts(data);
            handleCloseDialog();
        } catch (err) {
            console.error(err);
            openSnackbar(err?.message || 'Save failed', 'error');
        }
    };

    useEffect(() => {
        const fetchProducts = async () => {
            try {
                const data = await getProducts();
                setProducts(data);
            } catch (err) {
                setError(err.message || 'Failed to load products');
            } finally {
                setLoading(false);
            }
        };
        fetchProducts();
    }, []);

    return (
        <Box >

            <Toolbar />

            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mt: 4 }}>
                <Typography variant="h4">Product Management</Typography>
                <Button variant="contained" color="primary" onClick={handleOpenDialog}>
                    Add Product
                </Button>
            </Box>

            {loading ? (
                <Box sx={{ display: 'flex', justifyContent: 'center', mt: 6 }}>
                    <CircularProgress />
                </Box>
            ) : error ? (
                <Box sx={{ mt: 3 }}>
                    <Alert severity="error">{error}</Alert>
                </Box>
            ) : (
                <ProductList
                    products={products}
                    onEditProduct={handleEdit}
                    onDeleteProduct={handleDeleteRequest}
                />
            )}

            {/* Add/Edit Dialog */}
            <Dialog open={isDialogOpen} onClose={handleCloseDialog} maxWidth="md" fullWidth>
                <DialogTitle>{productToEdit ? 'Edit Product' : 'Add Product'}</DialogTitle>
                <DialogContent dividers>
                    <ProductForm productToEdit={productToEdit} onSubmit={handleSubmitProduct} onClose={handleCloseDialog} />
                </DialogContent>
            </Dialog>

            {/* Confirm Delete Dialog */}
            <Dialog open={confirmOpen} onClose={() => setConfirmOpen(false)}>
                <DialogTitle>Confirm delete</DialogTitle>
                <DialogContent dividers>
                    <Typography>
                        Are you sure you want to delete
                        {productToDelete ? ` "${productToDelete.Name_Product || productToDelete.name}"` : ''}?
                    </Typography>
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setConfirmOpen(false)}>Cancel</Button>
                    <Button color="error" variant="contained" onClick={handleConfirmDelete}>
                        Delete
                    </Button>
                </DialogActions>
            </Dialog>

            {/* Snackbar */}
            <Snackbar
                open={snackbar.open}
                autoHideDuration={3000}
                onClose={closeSnackbar}
                anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
            >
                <Alert onClose={closeSnackbar} severity={snackbar.severity} sx={{ width: '100%' }}>
                    {snackbar.message}
                </Alert>
            </Snackbar>
        </Box>
    );
};

export default ProductPage;