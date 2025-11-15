
import { Box, Paper, Table, TableContainer, TableBody, TableCell, TableHead, TableRow } from '@mui/material';
const ReusableTable = ({ data, columns }) => {
    return (
        <Box>
            <TableContainer component={Paper} elevation={8} sx={{ mt: 2, borderRadius: 2 }}>
                <Table>
                    <TableHead >
                        {
                            columns.map((column) => (
                                <TableCell align="center" key={column.header}>{column.header}</TableCell>
                            ))
                        }
                    </TableHead>
                    <TableBody>
                        {data.map((item) => (
                            <TableRow key={item[columns[0].field]}>
                                {
                                    columns.map((column) => (
                                        <TableCell align="center" key={column.field}>
                                            {column.render ? column.render(item) : item[column.field]}
                                        </TableCell>
                                    ))
                                }
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>
        </Box>

    )
}

export default ReusableTable;
