import React from 'react';
import {
    Box, Paper, Typography, TextField,
    FormControl, FormLabel, RadioGroup, FormControlLabel, Radio,
    Button, Divider
} from '@mui/material';

const ProductFilter = ({ filters, categories, brands, onFilterChange, onClearFilter }) => {

    const handleChange = (e) => {
        const { name, value } = e.target;
        onFilterChange({ ...filters, [name]: value });
    };

    // Style chung cho khung có thanh cuộn
    const scrollableBoxStyle = {
        maxHeight: '200px', // Giới hạn chiều cao 200px
        overflowY: 'auto',  // Tự động hiện thanh cuộn nếu dài quá
        pl: 1,              // Padding trái nhẹ
        '&::-webkit-scrollbar': { width: '6px' }, // Style thanh cuộn cho đẹp (tùy chọn)
        '&::-webkit-scrollbar-thumb': { backgroundColor: '#ccc', borderRadius: '4px' }
    };

    return (
        <Paper elevation={3} sx={{ p: 2 }}>
            <Typography variant="h6" gutterBottom sx={{ fontWeight: 'bold' }}>
                Bộ Lọc
            </Typography>

            {/* 1. Tìm kiếm */}
            <Box mb={3}>
                <TextField
                    fullWidth
                    label="Tìm tên sản phẩm..."
                    name="name"
                    value={filters.name || ''}
                    onChange={handleChange}
                    variant="outlined"
                    size="small"
                />
            </Box>

            <Divider sx={{ mb: 2 }} />

            {/* 2. Danh Mục (Có thanh cuộn) */}
            <Box mb={3}>
                <FormControl component="fieldset" fullWidth>
                    <FormLabel component="legend" sx={{ fontWeight: 'bold', mb: 1 }}>Danh Mục</FormLabel>

                    {/* --- THÊM BOX SCROLL Ở ĐÂY --- */}
                    <Box sx={scrollableBoxStyle}>
                        <RadioGroup
                            name="category_id"
                            value={filters.category_id || ''}
                            onChange={handleChange}
                        >
                            <FormControlLabel value="" control={<Radio size="small" />} label="Tất cả" />
                            {categories.map((cat) => (
                                <FormControlLabel
                                    key={cat.ID_Category}
                                    value={cat.ID_Category.toString()}
                                    control={<Radio size="small" />}
                                    label={cat.Name_Category}
                                />
                            ))}
                        </RadioGroup>
                    </Box>
                    {/* ----------------------------- */}
                </FormControl>
            </Box>

            <Divider sx={{ mb: 2 }} />

            {/* 3. Thương Hiệu (Có thanh cuộn) */}
            <Box mb={3}>
                <FormControl component="fieldset" fullWidth>
                    <FormLabel component="legend" sx={{ fontWeight: 'bold', mb: 1 }}>Thương Hiệu</FormLabel>

                    {/* --- THÊM BOX SCROLL Ở ĐÂY --- */}
                    <Box sx={scrollableBoxStyle}>
                        <RadioGroup
                            name="brand_id"
                            value={filters.brand_id || ''}
                            onChange={handleChange}
                        >
                            <FormControlLabel value="" control={<Radio size="small" />} label="Tất cả" />
                            {brands.map((brand) => (
                                <FormControlLabel
                                    key={brand.ID_Brand}
                                    value={brand.ID_Brand.toString()}
                                    control={<Radio size="small" />}
                                    label={brand.Name_Brand}
                                />
                            ))}
                        </RadioGroup>
                    </Box>
                    {/* ----------------------------- */}
                </FormControl>
            </Box>

            <Button variant="outlined" fullWidth color="secondary" onClick={onClearFilter}>
                Xóa bộ lọc
            </Button>
        </Paper>
    );
};

export default ProductFilter;