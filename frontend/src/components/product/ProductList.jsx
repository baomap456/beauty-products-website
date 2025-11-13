import ProductAction from './ProductAction';
import { Box, Paper, Table, TableContainer, TableBody, TableCell, TableHead, TableRow } from '@mui/material';
const ProductList = ({ products, onEditProduct, onDeleteProduct }) => {
    return (
        <Box>
            <TableContainer component={Paper} elevation={8} sx={{ mt: 2, borderRadius: 2 }}>
                <Table>
                    <TableHead>
                        <TableRow>
                            <TableCell align="center">ID</TableCell>
                            <TableCell align="center">Name_Product</TableCell>
                            <TableCell align="center">Price</TableCell>
                            <TableCell align="center">Stock</TableCell>
                            <TableCell align="center">Description</TableCell>
                            <TableCell align="center">Category</TableCell>
                            <TableCell align="center">Brand</TableCell>
                            <TableCell align="center">Actions</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {products.map((product) => (
                            <TableRow key={product.ID_Product}>
                                <TableCell align="center">{product.ID_Product}</TableCell>
                                <TableCell align="center">{product.Name_Product}</TableCell>
                                <TableCell align="center">{product.Price}</TableCell>
                                <TableCell align="center">{product.Stock}</TableCell>
                                <TableCell align="center">{product.Description}</TableCell>
                                <TableCell align="center">{product.Category.Name_Category}</TableCell>
                                <TableCell align="center">{product.Brand.Name_Brand}</TableCell>
                                <TableCell align="center">
                                    <ProductAction
                                        product={product}
                                        onEdit={onEditProduct}
                                        onDelete={onDeleteProduct}
                                    />
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>
        </Box>

    )
}

export default ProductList;
