import React, { useEffect, useState } from 'react';
import { Box, Container, Typography, Button, Grid, Card, CardContent, Chip, CircularProgress } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import AddressForm from '../../components/address/AddressForm';
import AddressList from '../../components/address/AddressList';
import { createAddress, getAddresses } from '../../api/user/address';

const AddressPage = () => {
    const [addresses, setAddresses] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showForm, setShowForm] = useState(false);
    const [selectedAddressId, setSelectedAddressId] = useState(null);

    const fetchAddresses = async () => {
        try {
            setLoading(true);
            const data = await getAddresses();
            setAddresses(data || []);

            if (data.length === 0) {
                setShowForm(true);
            }
            else {
                setShowForm(false);
            }

            if (data && data.length > 0) {
                setSelectedAddressId(getDefaultAddressId(data));
            }
        }
        catch (error) {
            alert("Lỗi tải địa chỉ!");
        }
        finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchAddresses();
    }, []);

    const handleSubmit = async (addressData) => {
        try {
            await createAddress(addressData);
            fetchAddresses();
        }
        catch (error) {
            alert("Lỗi thêm địa chỉ!");
        }
    }

    const handleSelectAddress = (address) => {
        const defaultId = getDefaultAddressId(addresses);

        // Trường hợp 1: Người dùng click vào chính cái đang được chọn
        if (selectedAddressId === address.ID_Address) {

            // Nếu nó KHÔNG PHẢI là mặc định -> Cho phép bỏ chọn -> Quay về mặc định
            if (address.ID_Address !== defaultId) {
                setSelectedAddressId(defaultId);
            }
            // Nếu nó LÀ mặc định -> Không làm gì cả (Không thể bỏ chọn mặc định để thành "không chọn gì")
        }
        // Trường hợp 2: Click vào một cái khác -> Chọn cái mới đó
        else {
            setSelectedAddressId(address.ID_Address);
        }
    };

    const getDefaultAddressId = (list) => {
        const defaultAddr = list.find(addr => addr.IsDefault);
        // Nếu có mặc định thì lấy, không thì lấy cái đầu tiên, không có nữa thì null
        return defaultAddr ? defaultAddr.ID_Address : (list[0]?.ID_Address || null);
    };

    if (loading) return <Box sx={{ display: 'flex', justifyContent: 'center', mt: 10 }}><CircularProgress /></Box>;

    return (
        <Container maxWidth="md" sx={{ py: 4 }}>

            {/* TRƯỜNG HỢP 1: ĐANG HIỆN FORM (Do user bấm thêm hoặc chưa có địa chỉ) */}
            {showForm ? (
                <Box>
                    <AddressForm
                        onSubmit={handleSubmit}
                        onCancel={addresses.length > 0 ? () => setShowForm(false) : null} // Chỉ cho hủy nếu đã có địa chỉ cũ
                    />
                </Box>
            ) : (
                // TRƯỜNG HỢP 2: ĐÃ CÓ ĐỊA CHỈ -> HIỆN DANH SÁCH CARD
                <Box>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 3 }}>
                        <Typography variant="h5">Sổ địa chỉ</Typography>
                        <Button variant="contained" startIcon={<AddIcon />} onClick={() => setShowForm(true)}>
                            Thêm địa chỉ mới
                        </Button>
                    </Box>

                    <Box>
                        {/* GỌI COMPONENT LIST Ở ĐÂY */}
                        <AddressList
                            addresses={addresses}
                            selectedId={selectedAddressId}
                            onSelect={handleSelectAddress}
                        />
                    </Box>

                    {/* Nút Tiếp tục thanh toán (nếu đây là trang checkout) */}
                    <Button variant="contained" fullWidth sx={{ mt: 3 }}>Tiếp tục thanh toán</Button>
                </Box>
            )}
        </Container>
    );
}

export default AddressPage;