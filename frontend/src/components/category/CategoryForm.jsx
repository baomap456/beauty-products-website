import { useEffect, useState } from "react";
import { TextField, DialogActions, Button, DialogTitle, DialogContent } from "@mui/material";
const CategoryForm = ({ categoryToEdit, onSubmit, onClose }) => {
    const [formdata, setFormData] = useState({
        Name_Category: '',
        Description: '',
    });
    useEffect(() => {
        if (categoryToEdit) {
            setFormData({
                Name_Category: categoryToEdit.Name_Category || '',
                Description: categoryToEdit.Description || '',
            });
        }
    }, [categoryToEdit]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    }

    const handleSubmit = (e) => {
        e.preventDefault();
        onSubmit(formdata);
    };

    return (
        <DialogTitle>{categoryToEdit ? 'Edit Category' : 'Add Category'}
            <DialogContent>
                <form onSubmit={handleSubmit}>
                    <TextField id="outlined-basic" label="Name_Category" name="Name_Category"
                        fullWidth
                        margin="normal"
                        value={formdata.Name_Category}
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
                        <Button variant="contained" color="secondary" onClick={onClose}>Cancel</Button>
                    </DialogActions>
                </form>

            </DialogContent>
        </DialogTitle>
    );
};

export default CategoryForm;