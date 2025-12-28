import React from 'react';
import {
    Dialog,
    Box,
    Typography,
    Table,
    TableHead,
    TableRow,
    TableCell,
    TableBody,
    TextField,
    Paper,
    IconButton,
    InputAdornment,
    Chip,
    LinearProgress,
    Stack,
    TableContainer,
    Button,
    Slide
} from '@mui/material';
import {
    Close as CloseIcon,
    School as SchoolIcon,
    Visibility as VisibilityIcon
} from '@mui/icons-material';

const GradingDialog = ({
    open,
    onClose,
    acaData,
    progress,
    info,
    rows,
    studentLoading,
    isMobile,
    onUpdateMark,
    onUpdateAssessment
}) => {
    return (
        <Dialog
            fullScreen
            open={open}
            onClose={onClose}
            TransitionComponent={Slide}
            TransitionProps={{ direction: 'up' }}
        >
            <Box sx={{ bgcolor: '#f8fafc', minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
                {/* Toolbar */}
                <Paper elevation={0} sx={{
                    p: { xs: 2, md: 3 },
                    display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                    bgcolor: '#fff', borderBottom: '1px solid #e2e8f0',
                    position: 'sticky', top: 0, zIndex: 1100
                }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                        <Box sx={{
                            p: 1, borderRadius: '12px', bgcolor: 'rgba(99, 102, 241, 0.1)', color: '#6366f1',
                            display: { xs: 'none', sm: 'flex' }
                        }}>
                            <SchoolIcon />
                        </Box>
                        <Box>
                            <Typography variant="h6" fontWeight={800} sx={{ color: '#0f172a', lineHeight: 1.2 }}>
                                {acaData.name} — Term {acaData.term}
                            </Typography>
                            <Typography variant="caption" sx={{ color: '#64748b', fontWeight: 600, display: 'flex', alignItems: 'center', gap: 0.5 }}>
                                Form {acaData.form} <span style={{ opacity: 0.3 }}>•</span> Class Student List
                            </Typography>
                        </Box>
                    </Box>

                    <Stack direction="row" spacing={3} alignItems="center">
                        {!isMobile && (
                            <Box sx={{ minWidth: 200 }}>
                                <Stack direction="row" justifyContent="space-between" mb={0.5}>
                                    <Typography variant="caption" fontWeight={700} color="textSecondary">Grading Progress</Typography>
                                    <Typography variant="caption" fontWeight={700} color="primary">{progress}%</Typography>
                                </Stack>
                                <LinearProgress
                                    variant="determinate"
                                    value={progress}
                                    sx={{
                                        height: 8, borderRadius: 4,
                                        bgcolor: '#f1f5f9',
                                        '& .MuiLinearProgress-bar': { borderRadius: 4, bgcolor: '#6366f1' }
                                    }}
                                />
                            </Box>
                        )}

                        <Stack direction="row" spacing={1} alignItems="center">
                            <Chip
                                label={info.status === "active" ? "Storage Open" : "Read Only"}
                                size="small"
                                sx={{
                                    fontWeight: 800,
                                    bgcolor: info.status === "active" ? '#dcfce7' : '#f1f5f9',
                                    color: info.status === "active" ? '#15803d' : '#64748b',
                                    px: 0.5
                                }}
                            />
                            <IconButton
                                onClick={onClose}
                                sx={{ bgcolor: '#f1f5f9', '&:hover': { bgcolor: '#fee2e2', color: '#ef4444' }, transition: 'all 0.2s' }}
                            >
                                <CloseIcon />
                            </IconButton>
                        </Stack>
                    </Stack>
                </Paper>

                {/* Content Area */}
                <Box sx={{
                    p: { xs: 1.5, md: 4 },
                    flexGrow: 1,
                    overflowX: 'hidden',
                    maxWidth: '1400px',
                    width: '100%',
                    mx: 'auto'
                }}>
                    {info.status === "active" ? (
                        <Paper
                            elevation={0}
                            sx={{
                                borderRadius: '20px',
                                border: '1px solid rgba(0,0,0,0.05)',
                                overflow: 'hidden',
                                bgcolor: '#fff',
                                boxShadow: '0 10px 40px rgba(0,0,0,0.05)'
                            }}
                        >
                            <TableContainer sx={{ maxHeight: 'calc(100vh - 160px)' }}>
                                <Table stickyHeader>
                                    <TableHead>
                                        <TableRow>
                                            <TableCell sx={{ bgcolor: '#f8fafc', fontWeight: 800, color: '#475569', width: 60 }}>#</TableCell>
                                            <TableCell sx={{ bgcolor: '#f8fafc', fontWeight: 800, color: '#475569' }}>Student Full Names</TableCell>
                                            <TableCell sx={{ bgcolor: '#f8fafc', fontWeight: 800, color: '#475569', width: { xs: 120, md: 180 }, textAlign: 'center' }}>
                                                Assessment <Typography variant="caption" sx={{ display: 'block', opacity: 0.6 }}>(40%)</Typography>
                                            </TableCell>
                                            <TableCell sx={{ bgcolor: '#f8fafc', fontWeight: 800, color: '#475569', width: { xs: 120, md: 180 }, textAlign: 'center' }}>
                                                Exam <Typography variant="caption" sx={{ display: 'block', opacity: 0.6 }}>(60%)</Typography>
                                            </TableCell>
                                        </TableRow>
                                    </TableHead>
                                    <TableBody>
                                        {studentLoading ? (
                                            Array.from({ length: 8 }).map((_, i) => (
                                                <TableRow key={i}>
                                                    <TableCell colSpan={4} sx={{ py: 3 }}><LinearProgress sx={{ opacity: 0.1, borderRadius: 2 }} /></TableCell>
                                                </TableRow>
                                            ))
                                        ) : rows.length === 0 ? (
                                            <TableRow>
                                                <TableCell colSpan={4} align="center" sx={{ py: 10 }}>
                                                    <Box sx={{ opacity: 0.4 }}>
                                                        <VisibilityIcon sx={{ fontSize: 60, mb: 2 }} />
                                                        <Typography fontWeight={700}>No Student Data</Typography>
                                                        <Typography variant="body2">No students have been enrolled in this class yet.</Typography>
                                                    </Box>
                                                </TableCell>
                                            </TableRow>
                                        ) : (
                                            rows.map((row, index) => (
                                                <TableRow
                                                    key={index}
                                                    hover
                                                    sx={{ '&:hover': { bgcolor: '#f8fafc' } }}
                                                >
                                                    <TableCell sx={{ color: '#94a3b8', fontWeight: 600 }}>{index + 1}</TableCell>
                                                    <TableCell>
                                                        <Typography sx={{ fontWeight: 700, color: '#1e293b' }}>
                                                            {row.last.toUpperCase() + " " + row.first.toUpperCase() || "Unknown Student"}
                                                        </Typography>
                                                        <Typography variant="caption" sx={{ color: '#64748b' }}>
                                                            ID: {row.student_reg || "N/A"}
                                                        </Typography>
                                                    </TableCell>
                                                    <TableCell>
                                                        <TextField
                                                            size="small"
                                                            type="number"
                                                            variant="outlined"
                                                            defaultValue={row.assessment}
                                                            onBlur={e => onUpdateAssessment(row.id, acaData.subject_id, acaData.form, acaData.academic_id, e.target.value)}
                                                            InputProps={{
                                                                endAdornment: <InputAdornment position="end" sx={{ '& .MuiTypography-root': { fontSize: 12, fontWeight: 700, opacity: 0.5 } }}>%</InputAdornment>,
                                                                sx: {
                                                                    borderRadius: '10px',
                                                                    fontWeight: 800,
                                                                    color: '#6366f1',
                                                                    '& input': { textAlign: 'center' },
                                                                    bgcolor: '#fcfdff'
                                                                }
                                                            }}
                                                            sx={{
                                                                maxWidth: 140, mx: 'auto',
                                                                '& .MuiOutlinedInput-root': {
                                                                    '& fieldset': { borderColor: 'rgba(99, 102, 241, 0.1)' },
                                                                    '&:hover fieldset': { borderColor: '#6366f1' },
                                                                    '&.Mui-focused fieldset': { borderColor: '#6366f1' }
                                                                }
                                                            }}
                                                        />
                                                    </TableCell>
                                                    <TableCell>
                                                        <TextField
                                                            size="small"
                                                            type="number"
                                                            variant="outlined"
                                                            defaultValue={row.end_term}
                                                            onBlur={e => onUpdateMark(row.id, acaData.subject_id, acaData.form, acaData.academic_id, e.target.value)}
                                                            InputProps={{
                                                                endAdornment: <InputAdornment position="end" sx={{ '& .MuiTypography-root': { fontSize: 12, fontWeight: 700, opacity: 0.5 } }}>%</InputAdornment>,
                                                                sx: {
                                                                    borderRadius: '10px',
                                                                    fontWeight: 800,
                                                                    color: '#059669',
                                                                    '& input': { textAlign: 'center' },
                                                                    bgcolor: '#fcfdff'
                                                                }
                                                            }}
                                                            sx={{
                                                                maxWidth: 140, mx: 'auto',
                                                                '& .MuiOutlinedInput-root': {
                                                                    '& fieldset': { borderColor: 'rgba(16, 185, 129, 0.1)' },
                                                                    '&:hover fieldset': { borderColor: '#10b981' },
                                                                    '&.Mui-focused fieldset': { borderColor: '#10b981' }
                                                                }
                                                            }}
                                                        />
                                                    </TableCell>
                                                </TableRow>
                                            ))
                                        )}
                                    </TableBody>
                                </Table>
                            </TableContainer>
                        </Paper>
                    ) : (
                        <Box sx={{
                            textAlign: 'center', py: 12, borderRadius: '24px',
                            bgcolor: 'rgba(239, 68, 68, 0.03)',
                            border: '2px dashed rgba(239, 68, 68, 0.1)'
                        }}>
                            <Typography variant="h4" fontWeight={900} color="error" gutterBottom sx={{ opacity: 0.8 }}>
                                Grading Period Locked
                            </Typography>
                            <Typography sx={{ color: '#64748b', mb: 4, maxWidth: 500, mx: 'auto' }}>
                                The administration has closed the mark entry window for this session.
                                You can view the list, but updates are currently disabled.
                            </Typography>
                            <Button
                                variant="outlined"
                                color="inherit"
                                onClick={onClose}
                                sx={{ borderRadius: '12px', textTransform: 'none', px: 4 }}
                            >
                                Return to My Classes
                            </Button>
                        </Box>
                    )}
                </Box>
            </Box>
        </Dialog>
    );
};

export default GradingDialog;
