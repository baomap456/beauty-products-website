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

const ProductPage = () => {
    //API 
    const [products, setProducts] = useState([]);
    const [categories, setCategories] = useState([]);
    const [brands, setBrands] = useState([]);
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

    const columns = [
        {
            header: 'ID', // Tiêu đề cột
            field: 'ID_Product' // Tên trường trong data
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
        // --- Đây là phần "tùy chỉnh" ---
        {
            header: 'Category',
            // Dùng "render" vì nó là object lồng nhau
            render: (row) => row.Category.Name_Category
        },
        {
            header: 'Brand',
            render: (row) => row.Brand.Name_Brand
        },
        {
            header: 'Actions',
            // Dùng "render" để hiển thị component
            render: (row) => (
                <ActionButtons
                    onEdit={() => handleEdit(row)}
                    onDelete={() => handleDeleteRequest(row)}
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
                // 1. Vẫn gọi cả 3 API
                const [productsResponse, brandsResponse, categoriesResponse] = await Promise.all([
                    getProducts(),
                    getBrands(),
                    getCategories()
                ]);

                // 2. Trích xuất mảng dữ liệu (Giả sử API trả về { items: [...] })
                //    Nếu API của bạn trả về mảng trực tiếp, hãy xóa ".items"
                const productsData = productsResponse.items || productsResponse;
                const brandsData = brandsResponse.items || brandsResponse;
                const categoriesData = categoriesResponse.items || categoriesResponse;

                // 3. Gộp dữ liệu lại cho ProductList (để fix lỗi crash)
                const productsWithDetails = productsData.map(product => {
                    // Tìm category tương ứng
                    const category = categoriesData.find(c => c.ID_Category === product.Category_ID);


                    // Tìm brand tương ứng
                    const brand = brandsData.find(b => b.ID_Brand === product.Brand_ID);

                    // Trả về product mới với object lồng nhau
                    return {
                        ...product,
                        Category: category || { Name_Category: 'N/A' }, // Gắn object category
                        Brand: brand || { Name_Brand: 'N/A' }       // Gắn object brand
                    };
                });

                console.log('Products with details:', productsWithDetails);

                // 4. Set state với dữ liệu đã xử lý
                setCategories(categoriesData); // Dùng cho dropdown
                setBrands(brandsData);       // Dùng cho dropdown
                setProducts(productsWithDetails); // Dùng cho bảng (đã gộp)

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
                <ReusableTable
                    data={products}
                    columns={columns}
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