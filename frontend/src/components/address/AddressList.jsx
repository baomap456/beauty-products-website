import React from 'react';
import { Grid, Typography } from '@mui/material';
import AddressCard from './AddressCard';

const AddressList = ({ addresses, selectedId, onSelect }) => {

    if (!addresses || addresses.length === 0) {
        return <Typography color="text.secondary">Chưa có địa chỉ nào.</Typography>;
    }

    return (
        <Grid container spacing={2}>
            {addresses.map((addr) => (
                <Grid item xs={12} sm={6} md={6} key={addr.ID_Address}>
                    <AddressCard
                        address={addr}
                        // Truyền logic "được chọn" xuống Card
                        isSelected={selectedId === addr.ID_Address}
                        onSelect={onSelect}
                    />
                </Grid>
            ))}
        </Grid>
    );
};

export default AddressList;