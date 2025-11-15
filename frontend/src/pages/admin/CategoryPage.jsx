import { useEffect, useState } from 'react';
import ReusableTable from '../../components/UI/ReusableTable';
import CategoryForm from '../../components/category/CategoryForm';
import ActionButtons from '../../components/UI/ActionButtons';
import { getCategories, createCategory, updateCategory, deleteCategory } from '../../api/category';
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
const CategoryPage = () => {
    // API
    const [categories, setCategories] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    // Dialog add/edit
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [categoryToEdit, setCategoryToEdit] = useState(null);

    const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });

    // Confirm delete
    const [confirmOpen, setConfirmOpen] = useState(false);
    const [categoryToDelete, setCategoryToDelete] = useState(null);

    const columns = [
        {
            header: 'ID', // Tiêu đề cột
            field: 'ID_Category' // Tên trường trong data
        },
        {
            header: 'Name_Category',
            field: 'Name_Category'
        },
        {
            header: 'Description',
            field: 'Description'
        },
        {
            header: 'Actions',
            // Dùng "render" để hiển thị component
            render: (row) => (
                <ActionButtons
                    onEdit={() => handleEditCategory(row)}
                    onDelete={() => handleDeleteRequest(row)}
                />
            )
        }
    ];

    const openSnackbar = (message, severity = 'success') =>
        setSnackbar({ open: true, message, severity });
    const closeSnackbar = () => setSnackbar((s) => ({ ...s, open: false }));

    const handleOpenDialog = () => {
        setCategoryToEdit(null);
        setIsDialogOpen(true);
    }
    const handleCloseDialog = () => {
        setIsDialogOpen(false);
        setCategoryToEdit(null);
    };
    const handleEditCategory = (category) => {
        setCategoryToEdit(category);
        setIsDialogOpen(true);
    }

    const handleDeleteRequest = (category) => {
        setCategoryToDelete(category);
        setConfirmOpen(true);
    };

    const handleDeleteCategory = async () => {
        if (!categoryToDelete) return;
        try {
            await deleteCategory(categoryToDelete.ID_Category);
            const data = await getCategories();
            setCategories(data);
            openSnackbar('Deleted category successfully');
        } catch (err) {
            setError('Failed to delete category');
            openSnackbar(err?.message || 'Delete failed', 'error');
        }
        finally {
            setConfirmOpen(false);
            setCategoryToDelete(null);
        }
    };

    const handleSubmitCategory = async (categoryData) => {
        try {
            if (categoryToEdit) {
                await updateCategory(categoryToEdit.ID_Category, categoryData);
                openSnackbar('Updated category successfully');
            }
            else {
                await createCategory(categoryData);
                openSnackbar('Created category successfully');
            }
            const data = await getCategories();
            setCategories(data);
            handleCloseDialog();
        } catch (err) {
            setError('Failed to save category');
            openSnackbar(err?.message || 'Save failed', 'error');
        }
    };

    useEffect(() => {
        const fetchCategories = async () => {
            try {
                setLoading(true);
                const data = await getCategories();
                setCategories(data);
            }
            catch (err) {
                setError('Failed to fetch categories');
                openSnackbar(err?.message || 'Fetch failed', 'error');
            }
            finally {
                setLoading(false);
            }
        };
        fetchCategories();
    }, []);

    return (
        <Box>
            <Toolbar />
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <Typography variant="h4">Category Management</Typography>
                <Button variant="contained" color="primary" onClick={handleOpenDialog}>
                    Add Category
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
                    data={categories}
                    columns={columns}
                />
            )}
            <Dialog open={isDialogOpen} onClose={handleCloseDialog} maxWidth="md" fullWidth>
                <DialogContent dividers>
                    <CategoryForm categoryToEdit={categoryToEdit} onSubmit={handleSubmitCategory} onClose={handleCloseDialog} />
                </DialogContent>
            </Dialog>

            <Dialog open={confirmOpen} onClose={() => setConfirmOpen(false)}>
                <DialogTitle>Confirm delete</DialogTitle>
                <DialogContent dividers>
                    <Typography>
                        Are you sure you want to delete
                        {categoryToDelete ? ` "${categoryToDelete.Name_Category || categoryToDelete.name}"` : ''}?
                    </Typography>
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setConfirmOpen(false)}>Cancel</Button>
                    <Button color="error" variant="contained" onClick={handleDeleteCategory}>
                        Delete
                    </Button>
                </DialogActions>
            </Dialog>

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
    )

}
export default CategoryPage;