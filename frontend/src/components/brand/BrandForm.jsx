import React, { useState, useEffect } from 'react';
import { TextField, DialogActions, Button, DialogTitle, DialogContent } from '@mui/material';
const BrandForm = ({ brandToEdit, onSubmit, onCancel }) => {
    const [formdata, setFormData] = useState({
        Name_Brand: '',
        Description: '',
    });

    useEffect(() => {
        if (brandToEdit) {
            setFormData({
                Name_Brand: brandToEdit.Name_Brand || '',
                Description: brandToEdit.Description || '',
            });
        }
    }, [brandToEdit]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    }

    const handleSubmit = (e) => {
        e.preventDefault();
        onSubmit(formdata);
    }

    return (
        <DialogTitle>{brandToEdit ? 'Edit Brand' : 'Add Brand'}
            <DialogContent>
                <form onSubmit={handleSubmit}>
                    <TextField id="outlined-basic" label="Name_Brand" name="Name_Brand"
                        fullWidth
                        margin="normal"
                        value={formdata.Name_Brand}
                        onChange={handleChange}
                        variant="outlined" />
                    <TextField id="outlined-basic" label="Description" name="Description"
                        fullWidth
                        margin="normal"
                        value={formdata.Description}
                        onChange={handleChange}
                        variant="outlined" />
                    <DialogActions mt={2} display="flex" justifyContent="space-between">
                        <Button variant="contained" color="primary" type="submit">Save</Button>
                        <Button variant="contained" color="secondary" onClick={onCancel}>Cancel</Button>
                    </DialogActions>
                </form>
            </DialogContent>
        </DialogTitle>
    )
}

export default BrandForm;