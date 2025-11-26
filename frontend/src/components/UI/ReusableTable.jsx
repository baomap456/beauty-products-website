import { Box, Paper, Table, TableContainer, TableBody, TableCell, TableHead, TableRow, TablePagination } from '@mui/material';

// Nhận thêm các props liên quan đến phân trang
const ReusableTable = ({ 
    data, 
    columns,
    totalCount = 0,         
    page = 0,              
    rowsPerPage = 10,      
    onPageChange,           
    onRowsPerPageChange     
}) => {
    return (
        <Box>
            <TableContainer component={Paper} elevation={8} sx={{ mt: 2, borderRadius: 2 }}>
                <Table>
                    <TableHead>
                        <TableRow>
                            {columns.map((column) => (
                                <TableCell align="center" key={column.header} sx={{ fontWeight: 'bold' }}>
                                    {column.header}
                                </TableCell>
                            ))}
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {data.map((item, index) => (
                            // Dùng index làm key dự phòng nếu không lấy được field đầu tiên
                            <TableRow key={item[columns[0].field] || index}>
                                {columns.map((column) => (
                                    <TableCell align="center" key={column.field || column.header}>
                                        {column.render ? column.render(item) : item[column.field]}
                                    </TableCell>
                                ))}
                            </TableRow>
                        ))}
                        
                        {/* Xử lý trường hợp không có dữ liệu */}
                        {data.length === 0 && (
                            <TableRow>
                                <TableCell colSpan={columns.length} align="center" sx={{ py: 3 }}>
                                    Không có dữ liệu
                                </TableCell>
                            </TableRow>
                        )}
                    </TableBody>
                </Table>

                {/* --- PHẦN PHÂN TRANG --- */}
                <TablePagination
                    rowsPerPageOptions={[5, 10, 25]} // Các tùy chọn số lượng
                    component="div"
                    count={totalCount}      // Tổng số dòng dữ liệu (Backend trả về)
                    rowsPerPage={rowsPerPage}
                    page={page}             // Trang hiện tại
                    onPageChange={onPageChange} 
                    onRowsPerPageChange={onRowsPerPageChange}
                    labelRowsPerPage="Số hàng mỗi trang:"
                />
            </TableContainer>
        </Box>
    )
}

export default ReusableTable;