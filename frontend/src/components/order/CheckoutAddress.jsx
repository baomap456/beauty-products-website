
import { Paper, Typography, Button, Box } from '@mui/material';
import LocationOnIcon from '@mui/icons-material/LocationOn';

const CheckoutAddress = ({ address }) => {
    return (
        <Paper sx={{ p: 3, mb: 3 }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                    <LocationOnIcon color="primary" sx={{ mr: 1 }} />
                    <Typography variant="h6" fontWeight="bold">Địa chỉ nhận hàng</Typography>
                </Box>
            </Box>

            {address ? (
                <Box sx={{ ml: 4 }}>
                    <Typography variant="subtitle1" fontWeight="bold">
                        {address.RecipientName} <Typography component="span" color="text.secondary">({address.Phone})</Typography>
                    </Typography>
                    <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>
                        {address.AddressDetail}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                        {address.Ward}, {address.District}, {address.Province}
                    </Typography>
                </Box>
            ) : (
                <Typography color="error" sx={{ ml: 4 }}>
                    Bạn chưa chọn địa chỉ nhận hàng.
                </Typography>
            )}
        </Paper>
    );
}

export default CheckoutAddress;