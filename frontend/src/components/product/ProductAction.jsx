import { Box, IconButton } from "@mui/material";
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';

const ProductAction = ({ product, onEdit, onDelete }) => {
    const handleEditClick = () => {
        onEdit(product);
    }

    const handleDeleteClick = () => {
        onDelete(product.id);
    }
    return (
        <Box>
            <IconButton onClick={handleEditClick} color="primary">
                <EditIcon className="fas fa-edit"></EditIcon>
            </IconButton>
            <IconButton onClick={handleDeleteClick} color="secondary">
                <DeleteIcon className="fas fa-trash-alt"></DeleteIcon>
            </IconButton>
        </Box>
    )

}

export default ProductAction;
