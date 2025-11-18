import React, { useState, useEffect } from 'react';
import ReusableTable from '../../components/UI/ReusableTable';
import BrandForm from '../../components/brand/BrandForm';
import ActionButtons from '../../components/UI/ActionButtons';
import { getBrands, createBrand, updateBrand, deleteBrand } from '../../api/admin/brand';
import { Box, Dialog, DialogContent, Toolbar, Typography, Button, CircularProgress, Alert, DialogActions, Snackbar } from '@mui/material';
const BrandPage = () => {
    const [brands, setBrands] = useState([]);
    const [brandToEdit, setBrandToEdit] = useState(null);
    const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const openSnackbar = (message, severity = 'success') =>
        setSnackbar({ open: true, message, severity });
    const closeSnackbar = () => setSnackbar((s) => ({ ...s, open: false }));

    const [isFormOpen, setIsFormOpen] = useState(false);
    const [confirmOpen, setConfirmOpen] = useState(false);

    const columns = [
        {
            header: 'ID', // Tiêu đề cột
            field: 'ID_Brand' // Tên trường trong data
        },
        {
            header: 'Name_Brand',
            field: 'Name_Brand'
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
                    onEdit={() => handleEditBrand(row)}
                    onDelete={() => handleDeleteRequest(row)}
                />
            )
        }
    ];

    const handleOpenDialog = () => {
        setBrandToEdit(null);
        setIsFormOpen(true);
    }

    const handleCloseDialog = () => {
        setIsFormOpen(false);
        setBrandToEdit(null);
    }

    const handleEditBrand = (brand) => {
        setBrandToEdit(brand);
        setIsFormOpen(true);
    }

    const handleDeleteRequest = (brand) => {
        setBrandToEdit(brand);
        setConfirmOpen(true);
    }

    const handleDeleteBrand = async () => {
        if (!brandToEdit) return;
        try {
            await deleteBrand(brandToEdit.ID_Brand);
            const data = await getBrands();
            setBrands(data);
            openSnackbar('Deleted brand successfully');
        }
        catch (err) {
            setError('Failed to delete brand');
            openSnackbar(err?.message || 'Delete failed', 'error');
        }
        finally {
            setConfirmOpen(false);
            setBrandToEdit(null);
        }
    };

    const handleSubmitBrand = async (brandData) => {
        try {
            console.log("Đang sửa Brand:", brandToEdit); // <--- Kiểm tra xem có ID_Brand không?
            console.log("Dữ liệu gửi đi:", brandData);
            if (brandToEdit) {
                await updateBrand(brandToEdit.ID_Brand, brandData);
                openSnackbar('Updated brand successfully');
            }
            else {
                await createBrand(brandData);
                openSnackbar('Created brand successfully');
            }
            const data = await getBrands();
            setBrands(data);
        } catch (err) {
            setError('Failed to submit brand');
            openSnackbar(err?.message || 'Submit failed', 'error');
        }
        finally {
            handleCloseDialog();
        }
    };

    useEffect(() => {
        const fetchBrands = async () => {
            try {
                setLoading(true);
                const data = await getBrands();
                setBrands(data);
            }
            catch (err) {
                setError('Failed to fetch brands');
                openSnackbar(err?.message || 'Fetch failed', 'error');
            }
            finally {
                setLoading(false);
            }
        };
        fetchBrands();
    }, []);

    return (
        <Box>
            <Toolbar />
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <Typography variant="h4">Brand Management</Typography>
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
                <ReusableTable data={brands} columns={columns} />
            )}
            <Dialog open={isFormOpen} onClose={handleCloseDialog} maxWidth="sm" fullWidth>
                <DialogContent dividers>
                    <BrandForm
                        brandToEdit={brandToEdit}
                        onSubmit={handleSubmitBrand}
                        onDelete={handleDeleteBrand}
                        onCancel={handleCloseDialog}
                    />
                </DialogContent>
            </Dialog>

            <Dialog open={confirmOpen} onClose={() => setConfirmOpen(false)} maxWidth="sm" fullWidth>
                <DialogContent dividers>
                    <Typography>Are you sure you want to delete the brand "{brandToEdit?.Name}"?</Typography>
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setConfirmOpen(false)} color="primary">
                        Cancel
                    </Button>
                    <Button onClick={handleDeleteBrand} color="secondary">
                        Delete
                    </Button>
                </DialogActions>
            </Dialog>

            <Snackbar
                open={snackbar.open}
                autoHideDuration={6000}
                onClose={closeSnackbar}
                message={snackbar.message}
                severity={snackbar.severity}
            />
        </Box>
    )
}
export default BrandPage;