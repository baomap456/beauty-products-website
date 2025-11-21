import React, { useState, useEffect, } from 'react';
import { Box, TextField, Button, Grid, FormControlLabel, Checkbox, Paper, Typography } from '@mui/material';
const AddressForm = ({ addressData, onSubmit, onCancel }) => {

    const [formData, setFormData] = useState({
        RecipientName: '',
        Phone: '',
        AddressDetail: '',
        Province: '',
        District: '',
        Ward: '',
        IsDefault: false
    });

    useEffect(() => {
        if (addressData) {
            setFormData({
                RecipientName: addressData.RecipientName || '',
                Phone: addressData.Phone || '',
                AddressDetail: addressData.AddressDetail || '',
                Province: addressData.Province || '',
                District: addressData.District || '',
                Ward: addressData.Ward || '',
                IsDefault: addressData.IsDefault || false
            });
        }
    }, [addressData]);


    const handleChange = (e) => {
        const { name, value, checked, type } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: type === 'checkbox' ? checked : value
        }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        onSubmit(formData);
    }

    return (
        <Paper elevation={3} sx={{ p: 3 }}>
            <Typography variant="h6" gutterBottom>
                {addressData ? "Cập nhật địa chỉ" : "Thêm địa chỉ mới"}
            </Typography>

            <form onSubmit={handleSubmit}>
                <Grid container spacing={2}>
                    <Grid item xs={12} sm={6}>
                        <TextField fullWidth label="Tên người nhận" name="RecipientName" value={formData.RecipientName} onChange={handleChange} required />
                    </Grid>
                    <Grid item xs={12} sm={6}>
                        <TextField fullWidth label="Số điện thoại" name="Phone" value={formData.Phone} onChange={handleChange} required />
                    </Grid>

                    {/* Địa chỉ chi tiết */}
                    <Grid item xs={12}>
                        <TextField fullWidth label="Địa chỉ chi tiết (Số nhà, đường...)" name="AddressDetail" value={formData.AddressDetail} onChange={handleChange} required multiline rows={2} />
                    </Grid>

                    {/* Khu vực (Có thể nâng cấp thành Select sau này) */}
                    <Grid item xs={12} sm={4}>
                        <TextField fullWidth label="Tỉnh / Thành phố" name="Province" value={formData.Province} onChange={handleChange} required />
                    </Grid>
                    <Grid item xs={12} sm={4}>
                        <TextField fullWidth label="Quận / Huyện" name="District" value={formData.District} onChange={handleChange} required />
                    </Grid>
                    <Grid item xs={12} sm={4}>
                        <TextField fullWidth label="Phường / Xã" name="Ward" value={formData.Ward} onChange={handleChange} required />
                    </Grid>

                    {/* Checkbox Mặc định */}
                    <Grid item xs={12}>
                        <FormControlLabel
                            control={<Checkbox checked={formData.IsDefault} onChange={handleChange} name="IsDefault" color="primary" />}
                            label="Đặt làm địa chỉ mặc định"
                        />
                    </Grid>

                    <Grid item xs={12} sx={{ display: 'flex', gap: 2, justifyContent: 'flex-end', mt: 2 }}>
                        {onCancel && (
                            <Button variant="outlined" color="secondary" onClick={onCancel}>
                                Hủy
                            </Button>
                        )}
                        <Button type="submit" variant="contained" color="primary">
                            Lưu địa chỉ
                        </Button>
                    </Grid>
                </Grid>
            </form>
        </Paper>
    );
}

export default AddressForm;