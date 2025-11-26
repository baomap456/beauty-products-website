import { useState, useEffect } from 'react';
import ReusableTable from '../../components/UI/ReusableTable';
import ProductForm from '../../components/product/ProductForm';
import { getProducts, createProduct, updateProduct, deleteProduct } from '../../api/admin/product';
import {
    Box,
    Button,
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
import { getBrands } from '../../api/admin/brand';
import { getCategories } from '../../api/admin/category';
import ActionButtons from '../../components/UI/ActionButtons';
import ProductDetail from '../../components/product/ProductFormDetail';

const ProductPage = () => {

    const [products, setProducts] = useState([]);
    const [categories, setCategories] = useState([]);
    const [brands, setBrands] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(10);
    const [totalCount, setTotalCount] = useState(0);

    
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [productToEdit, setProductToEdit] = useState(null);
    const [isViewOpen, setIsViewOpen] = useState(false);
    const [productToView, setProductToView] = useState(null);

    const [confirmOpen, setConfirmOpen] = useState(false);
    const [productToDelete, setProductToDelete] = useState(null);


    const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });

    const columns = [
        {
            header: 'ID', 
            field: 'ID_Product'
        },
        {
            header: 'Name_Product',
            field: 'Name_Product'
        },
        {
            header: 'Price',
            field: 'Price'
        },
        {
            header: 'Stock',
            field: 'Stock'
        },
        {
            header: 'Category',
            render: (row) => row.Category.Name_Category
        },
        {
            header: 'Brand',
            render: (row) => row.Brand.Name_Brand
        },
        {
            header: 'Actions',
            render: (row) => (
                <ActionButtons
                    onEdit={() => handleEdit(row)}
                    onDelete={() => handleDeleteRequest(row)}
                    onView={() => handleView(row)}
                />
            )
        }
    ];

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
            await deleteProduct(productToDelete.ID_Product);
            
            await refreshData(); 
            
            openSnackbar('Deleted product successfully');
        } catch (err) {
            console.error(err);
            openSnackbar(err?.message || 'Delete failed', 'error');
        } finally {
            setConfirmOpen(false);
            setProductToDelete(null);
        }
    };

    const handleView = (product) => {
        setProductToView(product);
        setIsViewOpen(true);
    }

    const handleSubmitProduct = async (formdata) => {
        try {
            // const imageFormData = new FormData();
            // if (mainImage) imageFormData.append('mainImage', mainImage);
            // (secondaryImage || []).forEach((image) => imageFormData.append('secondaryImage', image));
            // const resultUpload = await uploadImages(productToEdit ? productToEdit.ID_Product : 'new', imageFormData);
            const productData = {
                ...formdata,
                // mainImage: resultUpload.mainImageUrl,
                // secondaryImage: resultUpload.secondaryImageUrls
            };
            console.debug('Sending product payload:', productData);
            if (productToEdit) {
                await updateProduct(productToEdit.ID_Product, productData);
                openSnackbar('Updated product successfully');
            } else {
                await createProduct(productData);
                openSnackbar('Created product successfully');
            }

            await refreshData();
            handleCloseDialog();
        } catch (err) {
            console.error(err);
            openSnackbar(err?.message || 'Save failed', 'error');
        }
    };

    const refreshData = async () => {
        try {
            // Không set loading=true ở đây để tránh nháy trang khi update/delete
            // Hoặc set tùy ý bạn
            const params = {
                page: page + 1, 
                limit: rowsPerPage
            };
            const [productsResponse, brandsResponse, categoriesResponse] = await Promise.all([
                getProducts(params),
                getBrands(),
                getCategories()
            ]);

            // Xử lý data (Array hoặc Object {items: []})
            const productsData = productsResponse.items || productsResponse || [];
            const brandsData = brandsResponse.items || brandsResponse || [];
            const categoriesData = categoriesResponse.items || categoriesResponse || [];
            const total = productsResponse.totalCount || 0;

            // Logic Gộp dữ liệu (Merge)
            const productsWithDetails = productsData.map(product => {
                const category = categoriesData.find(c => c.ID_Category === product.Category_ID);
                const brand = brandsData.find(b => b.ID_Brand === product.Brand_ID);
                return {
                    ...product,
                    Category: category || { Name_Category: 'N/A' },
                    Brand: brand || { Name_Brand: 'N/A' }
                };
            });

            // Cập nhật State
            setCategories(categoriesData);
            setBrands(brandsData);
            setProducts(productsWithDetails);
            setTotalCount(total);

        } catch (err) {
            console.error("Error refreshing data:", err);
            setError(err.message || 'Failed to load data');
        }
    };

    useEffect(() => {
        const initData = async () => {
            setLoading(true);
            await refreshData();
            setLoading(false);
        };
        initData();
    }, [page, rowsPerPage]);

    const handleChangePage = (event, newPage) => {
        setPage(newPage);
    };

    const handleChangeRowsPerPage = (event) => {
        setRowsPerPage(parseInt(event.target.value, 10));
        setPage(0); // Reset về trang đầu
    };
    

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
                <ReusableTable
                    data={products}
                    columns={columns}
                    totalCount={totalCount}
                    page={page}
                    rowsPerPage={rowsPerPage}
                    onPageChange={handleChangePage}
                    onRowsPerPageChange={handleChangeRowsPerPage}
                />
            )}

            {/* Add/Edit Dialog */}
            <Dialog open={isDialogOpen} onClose={handleCloseDialog} maxWidth="md" fullWidth>
                <DialogTitle>{productToEdit ? 'Edit Product' : 'Add Product'}</DialogTitle>
                <DialogContent dividers>
                    <ProductForm
                        productToEdit={productToEdit}
                        onSubmit={handleSubmitProduct}
                        onClose={handleCloseDialog}
                        categories={categories}
                        brands={brands}
                    />
                </DialogContent>
            </Dialog>

            <Dialog open={isViewOpen} onClose={() => setIsViewOpen(false)} maxWidth="md" fullWidth>
             <ProductDetail 
                 product={productToView} 
                 onClose={() => setIsViewOpen(false)} 
             />
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