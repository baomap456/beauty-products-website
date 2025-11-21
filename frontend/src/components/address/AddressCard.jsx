import React from 'react';
import { Card, CardContent, Typography, Box, Chip } from '@mui/material';
import CheckCircleIcon from '@mui/icons-material/CheckCircle'; // Icon dấu tích

const AddressCard = ({ address, isSelected, onSelect }) => {
    return (
        <Card
            variant="outlined"
            onClick={() => onSelect(address)}
            sx={{
                cursor: 'pointer',
                position: 'relative',
                overflow: 'visible', // Để icon check có thể đè lên viền nếu muốn

                // Style khi được chọn: Viền xanh đậm, nền xanh nhạt
                border: isSelected ? '2px solid #1976d2' : '1px solid #e0e0e0',
                bgcolor: isSelected ? 'rgba(25, 118, 210, 0.04)' : 'white',

                transition: 'all 0.2s ease',
                '&:hover': {
                    borderColor: '#1976d2',
                    boxShadow: 3
                }
            }}
        >
            {/* --- ICON CHECK (DẤU TÍCH) --- */}
            {/* Chỉ hiện khi được chọn */}
            {isSelected && (
                <Box sx={{
                    position: 'absolute',
                    top: -10, // Nhảy lên góc trên
                    right: -10, // Nhảy sang góc phải
                    bgcolor: 'white', // Nền trắng để che viền card
                    borderRadius: '50%',
                    display: 'flex' // Để căn giữa icon
                }}>
                    <CheckCircleIcon color="primary" sx={{ fontSize: 28 }} />
                </Box>
            )}

            <CardContent>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 1, gap: 1 }}>
                    <Typography variant="subtitle1" fontWeight="bold">
                        {address.RecipientName} | {address.Phone}
                    </Typography>

                    {/* Badge Mặc định (Luôn hiện nếu là IsDefault) */}
                    {address.IsDefault && (
                        <Chip
                            label="Mặc định"
                            color="primary"
                            size="small"
                            variant="outlined" // Hoặc "filled" tùy thích
                            sx={{ height: 20, fontSize: '0.7rem', fontWeight: 'bold' }}
                        />
                    )}
                </Box>

                <Typography variant="body2" color="text.secondary">
                    {address.AddressDetail}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                    {address.Ward}, {address.District}, {address.Province}
                </Typography>
            </CardContent>
        </Card>
    );
};

export default AddressCard;