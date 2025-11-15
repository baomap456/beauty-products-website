import { Box, IconButton } from "@mui/material";
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import ViewIcon from '@mui/icons-material/Visibility';
const ActionButtons = ({ onEdit, onDelete, onView }) => {

    return (
        <Box>
            <IconButton onClick={onEdit} color="primary">
                <EditIcon className="fas fa-edit"></EditIcon>
            </IconButton>
            <IconButton onClick={onDelete} color="secondary">
                <DeleteIcon className="fas fa-trash-alt"></DeleteIcon>
            </IconButton>
            <IconButton onClick={onView} color="default">
                <ViewIcon className="fas fa-eye"></ViewIcon>
            </IconButton>
        </Box>
    )

}

export default ActionButtons;
