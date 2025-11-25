import React from 'react';
import { Paper, Typography, FormControl, RadioGroup, FormControlLabel, Radio, Box } from '@mui/material';
import LocalShippingIcon from '@mui/icons-material/LocalShipping';
import AccountBalanceWalletIcon from '@mui/icons-material/AccountBalanceWallet';

const PaymentMethod = ({ method, onChange }) => {
    return (
        <Paper sx={{ p: 3, mb: 3 }}>
            <Typography variant="h6" gutterBottom fontWeight="bold">
                Phương thức thanh toán
            </Typography>
            <FormControl component="fieldset" fullWidth>
                <RadioGroup
                    name="paymentMethod"
                    value={method}
                    onChange={(e) => onChange(e.target.value)}
                >
                    <FormControlLabel
                        value="COD"
                        control={<Radio />}
                        label={
                            <Box sx={{ display: 'flex', alignItems: 'center' }}>
                                <LocalShippingIcon color="action" sx={{ mr: 1 }} />
                                <Typography>Thanh toán khi nhận hàng (COD)</Typography>
                            </Box>
                        }
                        sx={{ mb: 1, border: '1px solid #eee', borderRadius: 1, p: 1, mx: 0 }}
                    />

                    <FormControlLabel
                        value="VNPAY"
                        control={<Radio />}
                        label={
                            <Box sx={{ display: 'flex', alignItems: 'center' }}>
                                <AccountBalanceWalletIcon color="primary" sx={{ mr: 1 }} />
                                <Typography>Ví VNPAY / Thẻ ATM / Internet Banking</Typography>
                            </Box>
                        }
                        sx={{ mb: 1, border: '1px solid #eee', borderRadius: 1, p: 1, mx: 0 }}
                    />
                </RadioGroup>
            </FormControl>
        </Paper>
    );
}

export default PaymentMethod;