import React, { useState, useEffect } from 'react';
import {
    Button,
    Dialog,
    Box,
    Typography,
    TextField,
    Table,
    TableHead,
    TableRow,
    TableCell,
    TableBody,
    Drawer,
    Switch,
    Paper,
    TableContainer,
    IconButton,
    Chip,
    InputAdornment,
    Stack,
    Divider
} from '@mui/material';
import {
    Add as AddIcon,
    Edit as EditIcon,
    Close as CloseIcon,
    Save as SaveIcon,
    CalendarMonth as CalendarIcon,
    Event as EventIcon,
    MonetizationOn as MoneyIcon,
    ListAlt as ListIcon
} from '@mui/icons-material';
import Toastify from 'toastify-js';
import "toastify-js/src/toastify.css";

const API_URL = "http://localhost/nkk_sec/api/index.php";

function AcademicYears() {
    const [open, setOpen] = useState({
        add: false,
        edit: false
    });
    const [rows, setRows] = useState([]);
    const [edit, setEdit] = useState({});

    const fetchAcademicYears = async () => {
        try {
            const res = await fetch(`${API_URL}?getAcademicYears=1`);
            const data = await res.json();
            setRows(data);
        } catch (error) {
            console.error("Error fetching academic years:", error);
            Toastify({ text: "Failed to load academic years", backgroundColor: "#ef4444" }).showToast();
        }
    };

    const handleSave = async (event, action) => {
        event.preventDefault();
        const formData = new FormData(event.target);
        const method = 'POST';

        try {
            const response = await fetch(API_URL, {
                method: method,
                body: new URLSearchParams(formData),
                headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
            });

            const text = await response.text();
            try {
                const res = JSON.parse(text);
                if (res.status) {
                    Toastify({
                        text: action === 'add' ? "Academic Year Added!" : "Updated Successfully!",
                        backgroundColor: "linear-gradient(135deg, #10b981 0%, #059669 100%)"
                    }).showToast();
                    setOpen(prev => ({ ...prev, [action]: false }));
                    fetchAcademicYears();
                } else {
                    Toastify({ text: res.message || "Error", backgroundColor: "#ef4444" }).showToast();
                }
            } catch (e) {
                console.error(text);
                Toastify({ text: "Server Error", backgroundColor: "#ef4444" }).showToast();
            }
        } catch (error) {
            Toastify({ text: "Connection Failed", backgroundColor: "#ef4444" }).showToast();
        }
    }

    const activate = async (id, status) => {
        try {
            const response = await fetch(API_URL, {
                method: 'POST',
                body: new URLSearchParams({ academic_id: id, status_edit: status }),
                headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
            });
            const res = await response.json();
            if (res.status) {
                Toastify({
                    text: status === 'active' ? "Activated! Reloading..." : "Deactivated!",
                    backgroundColor: "#10b981"
                }).showToast();
                fetchAcademicYears();
                if (status === 'active') {
                    setTimeout(() => window.location.reload(), 1000);
                }
            } else {
                Toastify({ text: res.message, backgroundColor: "#ef4444" }).showToast();
            }
        } catch (error) {
            Toastify({ text: "Error updating status", backgroundColor: "#ef4444" }).showToast();
        }
    }

    useEffect(() => {
        fetchAcademicYears();
    }, []);

    return (
        <Box>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
                <Typography variant="h6" sx={{ fontWeight: 700, color: '#1e293b' }}>
                    Academic Years
                </Typography>
                <Button
                    variant="contained"
                    startIcon={<AddIcon />}
                    onClick={() => setOpen({ ...open, add: true })}
                    sx={{
                        borderRadius: 2,
                        textTransform: 'none',
                        background: 'linear-gradient(135deg, #6366f1 0%, #4f46e5 100%)',
                        boxShadow: '0 4px 12px rgba(99, 102, 241, 0.3)'
                    }}
                >
                    Add Academic Year
                </Button>
            </Box>

            <Paper elevation={0} sx={{ borderRadius: 2, border: '1px solid #e2e8f0', overflow: 'hidden' }}>
                <TableContainer>
                    <Table>
                        <TableHead>
                            <TableRow sx={{ bgcolor: '#f8fafc' }}>
                                <TableCell sx={{ fontWeight: 600, color: '#475569' }}>#</TableCell>
                                <TableCell sx={{ fontWeight: 600, color: '#475569' }}>Year</TableCell>
                                <TableCell sx={{ fontWeight: 600, color: '#475569' }}>Term</TableCell>
                                <TableCell sx={{ fontWeight: 600, color: '#475569' }}>Opening</TableCell>
                                <TableCell sx={{ fontWeight: 600, color: '#475569' }}>Closing</TableCell>
                                <TableCell sx={{ fontWeight: 600, color: '#475569' }}>Next Term</TableCell>
                                <TableCell sx={{ fontWeight: 600, color: '#475569' }}>Fees</TableCell>
                                <TableCell sx={{ fontWeight: 600, color: '#475569' }}>Status</TableCell>
                                <TableCell sx={{ fontWeight: 600, color: '#475569' }} align="right">Actions</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {rows.length === 0 ? (
                                <TableRow>
                                    <TableCell colSpan={9} align="center" sx={{ py: 4, color: '#64748b' }}>No data found.</TableCell>
                                </TableRow>
                            ) : (
                                rows.map((row, index) => (
                                    <TableRow key={index} hover>
                                        <TableCell sx={{ color: '#64748b' }}>{index + 1}</TableCell>
                                        <TableCell sx={{ fontWeight: 600 }}>{row.name}</TableCell>
                                        <TableCell>{row.term}</TableCell>
                                        <TableCell sx={{ color: '#64748b', fontSize: 13 }}>{row.opening_term}</TableCell>
                                        <TableCell sx={{ color: '#64748b', fontSize: 13 }}>{row.closing_term}</TableCell>
                                        <TableCell sx={{ color: '#64748b', fontSize: 13 }}>{row.next_term_begins}</TableCell>
                                        <TableCell>{row.fees}</TableCell>
                                        <TableCell>
                                            <Chip
                                                label={row.status}
                                                size="small"
                                                sx={{
                                                    textTransform: 'capitalize',
                                                    fontWeight: 600,
                                                    bgcolor: row.status === 'active' ? '#dcfce7' : '#fee2e2',
                                                    color: row.status === 'active' ? '#15803d' : '#b91c1c'
                                                }}
                                            />
                                        </TableCell>
                                        <TableCell align="right">
                                            <IconButton
                                                size="small"
                                                onClick={() => {
                                                    setEdit(row);
                                                    setOpen({ ...open, edit: true });
                                                }}
                                                sx={{ color: '#6366f1' }}
                                            >
                                                <EditIcon fontSize="small" />
                                            </IconButton>
                                        </TableCell>
                                    </TableRow>
                                ))
                            )}
                        </TableBody>
                    </Table>
                </TableContainer>
            </Paper>

            {/* ADD DIALOG */}
            <Dialog
                open={open.add}
                onClose={() => setOpen({ ...open, add: false })}
                PaperProps={{ sx: { borderRadius: 3, width: 450 } }}
            >
                <Box sx={{ p: 3, display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid #f1f5f9' }}>
                    <Typography variant="h6" fontWeight={700}>Add Academic Year</Typography>
                    <IconButton onClick={() => setOpen({ ...open, add: false })} size="small"><CloseIcon /></IconButton>
                </Box>
                <form onSubmit={(e) => handleSave(e, 'add')}>
                    <Box sx={{ p: 3, maxHeight: '60vh', overflowY: 'auto' }}>
                        <TextField
                            label="Academic Year (e.g. 2024-2025)"
                            name="academic_year"
                            fullWidth size="small" sx={{ mb: 2 }}
                            InputProps={{ startAdornment: <InputAdornment position="start"><CalendarIcon fontSize="small" /></InputAdornment> }}
                        />
                        <TextField
                            label="Term (e.g. Term 1)"
                            name="term"
                            fullWidth size="small" sx={{ mb: 2 }}
                            InputProps={{ startAdornment: <InputAdornment position="start"><EventIcon fontSize="small" /></InputAdornment> }}
                        />

                        <Typography variant="caption" sx={{ color: '#64748b', mb: 1, display: 'block' }}>Key Dates</Typography>
                        <Stack spacing={2} sx={{ mb: 2 }}>
                            <TextField label="Opening Date" name="opening_date" type="date" size="small" fullWidth InputLabelProps={{ shrink: true }} />
                            <TextField label="Closing Date" name="closing_date" type="date" size="small" fullWidth InputLabelProps={{ shrink: true }} />
                            <TextField label="Next Term Begins" name="next_term_begins_on" type="date" size="small" fullWidth InputLabelProps={{ shrink: true }} />
                        </Stack>

                        <TextField
                            label="Fees"
                            name="fees"
                            fullWidth size="small" sx={{ mb: 2 }}
                            InputProps={{ startAdornment: <InputAdornment position="start"><MoneyIcon fontSize="small" /></InputAdornment> }}
                        />
                        <TextField
                            label="Requirements"
                            name="school_requirements"
                            multiline rows={2}
                            fullWidth size="small"
                            InputProps={{ startAdornment: <InputAdornment position="start"><ListIcon fontSize="small" /></InputAdornment> }}
                        />
                    </Box>
                    <Box sx={{ p: 3, pt: 0, display: 'flex', gap: 2 }}>
                        <Button onClick={() => setOpen({ ...open, add: false })} fullWidth variant="outlined" sx={{ borderRadius: 2 }}>Cancel</Button>
                        <Button type="submit" fullWidth variant="contained" sx={{ borderRadius: 2, background: 'linear-gradient(135deg, #6366f1 0%, #4f46e5 100%)' }}>Save</Button>
                    </Box>
                </form>
            </Dialog>

            {/* EDIT DRAWER */}
            <Drawer
                anchor="right"
                open={open.edit}
                onClose={() => setOpen({ ...open, edit: false })}
                PaperProps={{ sx: { width: { xs: '100%', sm: 450 } } }}
            >
                <Box sx={{ p: 3, display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid #f1f5f9' }}>
                    <Typography variant="h6" fontWeight={700}>Edit Academic Year</Typography>
                    <IconButton onClick={() => setOpen({ ...open, edit: false })}><CloseIcon /></IconButton>
                </Box>

                <form onSubmit={(e) => handleSave(e, 'edit')} style={{ padding: 24, overflowY: 'auto', flexGrow: 1 }}>
                    <input type="hidden" name="academic_year_id_edit" value={edit.id || ''} />

                    <Stack spacing={3}>
                        <TextField label="Academic Name" name="academic_name_edit" value={edit.name || ''} onChange={e => setEdit({ ...edit, name: e.target.value })} fullWidth size="small" />
                        <TextField label="Term" name="term_edit" value={edit.term || ''} onChange={e => setEdit({ ...edit, term: e.target.value })} fullWidth size="small" />

                        <Box>
                            <Typography variant="caption" sx={{ color: '#64748b' }}>Opening Date</Typography>
                            <TextField name="opening_term_edit" type="date" value={edit.opening_term || ''} onChange={e => setEdit({ ...edit, opening_term: e.target.value })} fullWidth size="small" />
                        </Box>
                        <Box>
                            <Typography variant="caption" sx={{ color: '#64748b' }}>Closing Date</Typography>
                            <TextField name="closing_term_edit" type="date" value={edit.closing_term || ''} onChange={e => setEdit({ ...edit, closing_term: e.target.value })} fullWidth size="small" />
                        </Box>
                        <Box>
                            <Typography variant="caption" sx={{ color: '#64748b' }}>Next Term Begins</Typography>
                            <TextField name="next_term_begins_edit" type="date" value={edit.next_term_begins || ''} onChange={e => setEdit({ ...edit, next_term_begins: e.target.value })} fullWidth size="small" />
                        </Box>

                        <TextField label="Fees" name="fees_edit" value={edit.fees || ''} onChange={e => setEdit({ ...edit, fees: e.target.value })} fullWidth size="small" />
                        <TextField label="Requirements" name="school_requirements_edit" value={edit.requirements || ''} onChange={e => setEdit({ ...edit, requirements: e.target.value })} multiline rows={3} fullWidth size="small" />

                        <Box sx={{ bgcolor: '#f8fafc', p: 2, borderRadius: 2 }}>
                            <Stack direction="row" justifyContent="space-between" alignItems="center">
                                <Typography variant="body2" fontWeight={600}>Active Status</Typography>
                                <Switch
                                    checked={edit.status === "active"}
                                    onChange={e => {
                                        const newStatus = e.target.checked ? "active" : "inactive";
                                        setEdit({ ...edit, status: newStatus });
                                        activate(edit.id, newStatus);
                                    }}
                                    color="success"
                                />
                            </Stack>
                            <Typography variant="caption" color="textSecondary">
                                Activating this year will deactivate all others.
                            </Typography>
                        </Box>

                        <Button
                            type="submit"
                            fullWidth
                            variant="contained"
                            sx={{
                                py: 1.5,
                                borderRadius: 2,
                                background: 'linear-gradient(135deg, #6366f1 0%, #4f46e5 100%)'
                            }}
                        >
                            Update Changes
                        </Button>
                    </Stack>
                </form>
            </Drawer>
        </Box>
    );
}

export default AcademicYears;
