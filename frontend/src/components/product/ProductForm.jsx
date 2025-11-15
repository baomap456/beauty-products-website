import { useEffect, useState } from 'react';
import { TextField, Button, Box, FormControl, InputLabel, Select, MenuItem } from '@mui/material';
const ProductForm = ({ productToEdit, onSubmit, onClose, categories, brands }) => {
    const [formdata, setFormData] = useState({
        Name_Product: '',
        Price: '',
        Stock: '',
        Description: '',
        Category_ID: '',
        Brand_ID: ''
    });
    // const [mainImage, setMainImage] = useState(null);
    // const [secondaryImage, setSecondaryImage] = useState([]);

    useEffect(() => {
        if (productToEdit) {
            setFormData({
                Name_Product: productToEdit.Name_Product || '',
                Price: productToEdit.Price || '',
                Stock: productToEdit.Stock || '',
                Description: productToEdit.Description || '',
                Category_ID: productToEdit.Category_ID || '',
                Brand_ID: productToEdit.Brand_ID || ''
            });
        }
        else {
            setFormData({
                Name_Product: '',
                Price: '',
                Stock: '',
                Description: '',
                Category_ID: '',
                Brand_ID: ''
            });
        }
    }, [productToEdit]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    }

    const handleSubmit = (e) => {
        e.preventDefault();
        onSubmit(formdata);
        // onSubmit(formdata, mainImage, secondaryImage);
    }

    // const handleMainImageChange = (e) => {
    //     setMainImage(e.target.files[0]);
    // }

    // const handleSecondaryImageChange = (e) => {
    //     setSecondaryImage(Array.from(e.target.files));
    // }

    return (
        <form onSubmit={handleSubmit}>

            <TextField id="outlined-basic" label="Name_Product" name="Name_Product"
                fullWidth
                margin="normal"
                value={formdata.Name_Product}
                onChange={handleChange}
                variant="outlined"
            />
            <TextField id="outlined-basic" label="Price" name="Price" type="number"
                fullWidth
                margin="normal"
                value={formdata.Price}
                onChange={handleChange}
                variant="outlined"
            />
            <TextField id="outlined-basic" label="Stock" name="Stock" type="number"
                fullWidth
                margin="normal"
                value={formdata.Stock}
                onChange={handleChange}
                variant="outlined"
            />
            <FormControl fullWidth margin="normal">
                <InputLabel id="category-select-label">Category</InputLabel>
                <Select
                    labelId="category-select-label"
                    name="Category_ID" // <-- Tên phải khớp với state
                    value={formdata.Category_ID} // <-- Giá trị từ state
                    onChange={handleChange}
                    label="Category"
                >
                    {/* Lặp qua mảng categories */}
                    {categories.map((category) => (
                        <MenuItem
                            key={category.ID_Category}
                            value={category.ID_Category} // <-- Giá trị là ID
                        >
                            {category.Name_Category} {/* Hiển thị là Name */}
                        </MenuItem>
                    ))}
                </Select>
            </FormControl>

            <FormControl fullWidth margin="normal">
                <InputLabel id="brand-select-label">Brand</InputLabel>
                <Select
                    labelId="brand-select-label"
                    name="Brand_ID" // <-- Tên phải khớp với state
                    value={formdata.Brand_ID} // <-- Giá trị từ state
                    onChange={handleChange}
                    label="Brand"
                >
                    {/* Lặp qua mảng brands */}
                    {brands.map((brand) => (
                        <MenuItem
                            key={brand.ID_Brand}
                            value={brand.ID_Brand} // <-- Giá trị là ID
                        >
                            {brand.Name_Brand} {/* Hiển thị là Name */}
                        </MenuItem>
                    ))}
                </Select>
            </FormControl>

            <TextField id="outlined-basic" label="Description" name="Description"
                fullWidth
                margin="normal"
                value={formdata.Description}
                onChange={handleChange}
                variant="outlined"
            />
            {/* 
            <Box>
                <Button component="label">
                    <input type="file" hidden onChange={handleMainImageChange} />
                    Main Image
                </Button>
                <Button component="label">
                    <input type="file" hidden onChange={handleSecondaryImageChange} />
                    Secondary Image
                </Button>
            </Box> */}

            <Box mt={2} display="flex" justifyContent="space-between">
                <Button variant="contained" color="primary" type="submit">Save</Button>
                <Button variant="outlined" color="secondary" onClick={onClose}>Cancel</Button>
            </Box>

        </form>
    )

}

export default ProductForm;