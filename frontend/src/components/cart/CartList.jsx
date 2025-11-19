import {
    Grid,
    Box,
    Typography

} from '@mui/material';
import CartItem from './CartItem';
const CartList = ({ items, onUpdate, onRemove }) => {
    return (
        <Box>
            {/* --- HEADER --- */}
            <Box sx={{
                display: { xs: 'none', sm: 'block' },
                mb: 2,
                px: 2 // Padding này khớp với padding của Card
            }}>
                <Grid container spacing={2} alignItems="center">

                    {/* Cột 1: Sản phẩm (Căn Trái) */}
                    <Grid item xs={5}>
                        <Typography variant="subtitle2" fontWeight="bold" color="text.secondary">Sản phẩm</Typography>
                    </Grid>

                    {/* Cột 2: Số lượng (Căn Giữa) */}
                    <Grid item xs={3} sx={{ display: 'flex', justifyContent: 'center' }}>
                        <Typography variant="subtitle2" fontWeight="bold" color="text.secondary">Số lượng</Typography>
                    </Grid>

                    {/* Cột 3: Thành tiền (Căn Giữa) */}
                    <Grid item xs={3} sx={{ display: 'flex', justifyContent: 'center' }}>
                        <Typography variant="subtitle2" fontWeight="bold" color="text.secondary">Thành tiền</Typography>
                    </Grid>

                    {/* Cột 4: Trống (Để khớp với nút xóa căn phải) */}
                    <Grid item xs={1}></Grid>

                </Grid>
            </Box>

            {/* --- BODY --- */}
            {items.map(item => (
                <CartItem
                    key={item.ID_CartItem}
                    cartItem={item}
                    onUpdateQuantity={onUpdate}
                    onRemoveItem={onRemove}
                />
            ))}
        </Box>
    );
}

export default CartList;