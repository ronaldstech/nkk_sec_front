import React from 'react';
import {
    Box,
    Paper,
    Table,
    TableHead,
    TableRow,
    TableCell,
    TableBody,
    TablePagination,
    TableContainer,
    Typography,
    Avatar,
    Tooltip,
    IconButton,
    InputBase,
    LinearProgress,
    Chip,
    useTheme,
    useMediaQuery
} from '@mui/material';
import {
    Edit as EditIcon,
    Search as SearchIcon
} from '@mui/icons-material';

const StaffTable = ({
    rows = [],
    loading = false,
    page = 0,
    rowsPerPage = 10,
    onPageChange,
    onRowsPerPageChange,
    onEditClick,
    search = '',
    onSearchChange
}) => {

    /* ================= RESPONSIVE ================= */
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

    /* ================= FILTER ================= */
    const filteredRows = rows.filter(row =>
        row.username?.toLowerCase().includes(search.toLowerCase()) ||
        row.phone?.includes(search)
    );

    return (
        <Paper
            elevation={0}
            sx={{
                borderRadius: 2,
                border: '1px solid #e2e8f0',
                overflow: 'hidden'
            }}
        >
            {/* ================= SEARCH ================= */}
            <Box
                sx={{
                    px: 2,
                    py: 1.5,
                    borderBottom: '1px solid #e2e8f0',
                    backgroundColor: '#f8fafc',
                    display: 'flex',
                    justifyContent: 'flex-end'
                }}
            >
                <Box
                    sx={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: 1,
                        px: 2,
                        py: 0.8,
                        borderRadius: 2,
                        backgroundColor: '#ffffff',
                        border: '1px solid #e2e8f0',
                        width: '100%',
                        maxWidth: 320
                    }}
                >
                    <SearchIcon sx={{ color: '#94a3b8' }} />
                    <InputBase
                        fullWidth
                        placeholder="Search staff..."
                        value={search}
                        onChange={onSearchChange}
                        sx={{ fontSize: 14 }}
                    />
                </Box>
            </Box>

            {/* ================= LOADING ================= */}
            {loading && (
                <LinearProgress
                    sx={{
                        height: 3,
                        '& .MuiLinearProgress-bar': {
                            background: 'linear-gradient(90deg,#6366f1,#4f46e5)'
                        }
                    }}
                />
            )}

            {/* ================= TABLE ================= */}
            <TableContainer>
                <Table stickyHeader>
                    <TableHead>
                        <TableRow>
                            <TableCell sx={headStyle}>#</TableCell>
                            <TableCell sx={headStyle}>User</TableCell>

                            {!isMobile && <TableCell sx={headStyle}>Phone</TableCell>}
                            {!isMobile && <TableCell sx={headStyle}>Profile</TableCell>}
                            {!isMobile && <TableCell sx={headStyle}>Account</TableCell>}

                            <TableCell sx={headStyle}>Status</TableCell>
                            <TableCell sx={headStyle} align="right">Action</TableCell>
                        </TableRow>
                    </TableHead>

                    <TableBody>
                        {!loading && filteredRows.length === 0 && (
                            <TableRow>
                                <TableCell colSpan={isMobile ? 4 : 7} align="center" sx={{ py: 6 }}>
                                    <Typography sx={{ color: '#64748b' }}>
                                        No staff members found
                                    </Typography>
                                </TableCell>
                            </TableRow>
                        )}

                        {filteredRows
                            .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                            .map((row, index) => (
                                <TableRow
                                    key={index}
                                    hover
                                    sx={{
                                        '&:hover': { backgroundColor: '#f8fafc' }
                                    }}
                                >
                                    <TableCell sx={cellMuted}>
                                        {page * rowsPerPage + index + 1}
                                    </TableCell>

                                    <TableCell sx={{ fontWeight: 600 }}>
                                        {row.username}
                                    </TableCell>

                                    {!isMobile && (
                                        <TableCell sx={cellMuted}>
                                            {row.phone}
                                        </TableCell>
                                    )}

                                    {!isMobile && (
                                        <TableCell>
                                            <Avatar
                                                src="/images/profile.jpg"
                                                alt={row.username}
                                                sx={{ width: 36, height: 36 }}
                                            />
                                        </TableCell>
                                    )}

                                    {!isMobile && (
                                        <TableCell>
                                            <Chip
                                                label={row.acc_type}
                                                size="small"
                                                sx={{
                                                    fontWeight: 600,
                                                    textTransform: 'capitalize',
                                                    backgroundColor:
                                                        row.acc_type === 'admin'
                                                            ? '#ede9fe'
                                                            : '#eef2ff',
                                                    color:
                                                        row.acc_type === 'admin'
                                                            ? '#6d28d9'
                                                            : '#4338ca'
                                                }}
                                            />
                                        </TableCell>
                                    )}

                                    <TableCell>
                                        <Chip
                                            label={row.status}
                                            size="small"
                                            sx={{
                                                fontWeight: 600,
                                                textTransform: 'capitalize',
                                                backgroundColor:
                                                    row.status === 'active'
                                                        ? '#dcfce7'
                                                        : '#fee2e2',
                                                color:
                                                    row.status === 'active'
                                                        ? '#15803d'
                                                        : '#b91c1c'
                                            }}
                                        />
                                    </TableCell>

                                    <TableCell align="right">
                                        <Tooltip title="Edit staff">
                                            <IconButton
                                                size="small"
                                                onClick={() => onEditClick(row)}
                                                sx={{
                                                    color: '#6366f1',
                                                    '&:hover': {
                                                        backgroundColor: '#eef2ff'
                                                    }
                                                }}
                                            >
                                                <EditIcon fontSize="small" />
                                            </IconButton>
                                        </Tooltip>
                                    </TableCell>
                                </TableRow>
                            ))}
                    </TableBody>
                </Table>
            </TableContainer>

            {/* ================= PAGINATION ================= */}
            <TablePagination
                component="div"
                count={filteredRows.length}
                page={page}
                rowsPerPage={rowsPerPage}
                onPageChange={onPageChange}
                onRowsPerPageChange={onRowsPerPageChange}
                rowsPerPageOptions={[5, 10, 25, 50]}
                sx={{ borderTop: '1px solid #e2e8f0' }}
            />
        </Paper>
    );
};

/* ================= STYLES ================= */
const headStyle = {
    fontWeight: 700,
    fontSize: 12,
    color: '#475569',
    backgroundColor: '#f8fafc',
    textTransform: 'uppercase',
    letterSpacing: '.05em'
};

const cellMuted = {
    color: '#64748b'
};

export default StaffTable;
