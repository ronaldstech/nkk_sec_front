import React, { useState, useEffect } from 'react';
import {
    Button,
    Dialog,
    Box,
    Typography,
    Table,
    TableHead,
    TableRow,
    TableCell,
    TableBody,
    Drawer,
    Checkbox,
    FormGroup,
    FormControlLabel,
    Stack,
    Alert,
    Paper,
    TableContainer,
    IconButton,
    Chip,
    Avatar,
    Menu,
    MenuItem
} from '@mui/material';
import {
    Close as CloseIcon,
    Settings as SettingsIcon,
    AddCircle as AddIcon,
    Delete as DeleteIcon,
    ArrowDropDown as ArrowDropDownIcon
} from '@mui/icons-material';
import Toastify from 'toastify-js';
import "toastify-js/src/toastify.css";

const API_URL = "http://localhost/nkk_sec/api/index.php";

function SubjectTeachers() {
    const [rows, setRows] = useState([]);
    const [academic, setAcademic] = useState({
        id: 0,
        name: "Loading...",
        term: ""
    });

    const [open, setOpen] = useState({
        add: false,
        addsub: false
    });

    const [manage, setManage] = useState({});
    const [subs, setSubs] = useState([]);
    const [subt, setSubt] = useState([]);
    const [form, setForm] = useState(0);

    /* --- Form Dropdown State --- */
    const [anchorEl, setAnchorEl] = useState(null);
    const formMenuOpen = Boolean(anchorEl);

    /* ================= DATA FETCHING ================= */
    const getAcademic = async () => {
        try {
            const res = await fetch(`${API_URL}?getAcademic=true`);
            const data = await res.json();
            setAcademic(data);
        } catch (error) {
            console.error("Error fetching academic:", error);
        }
    };

    const getStaff = async () => {
        if (!academic.id) return;
        try {
            // Updated API param to match context
            const res = await fetch(`${API_URL}?getStaffA=${academic.id}`);
            const data = await res.json();
            setRows(data);
        } catch (error) {
            console.error("Error fetching staff:", error);
        }
    };

    const getSubs = async () => {
        try {
            const res = await fetch(`${API_URL}?getSubs=true`);
            const data = await res.json();
            setSubs(data);
        } catch (error) {
            console.error("Error fetching subjects:", error);
        }
    };

    const getSubt = async (teacherId, academicId) => {
        try {
            const res = await fetch(`${API_URL}?getSubt=true&academic_id=${academicId}&teacher_id=${teacherId}`);
            const data = await res.json();
            setSubt(data);
        } catch (error) {
            console.error("Error fetching teacher subjects:", error);
        }
    };

    /* ================= ACTIONS ================= */
    const select_subject = async (subj) => {
        const body = new URLSearchParams({
            teacher_id: manage.id,
            subject_id: subj.id,
            form: form,
            academic_id: academic.id
        });

        try {
            const response = await fetch(API_URL, {
                method: 'POST',
                body: body,
                headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
            });
            const res = await response.json();
            Toastify({ text: res.message, backgroundColor: "#4f46e5" }).showToast();
            getSubt(manage.id, academic.id);
            getStaff(); // Refresh counts
        } catch (error) {
            Toastify({ text: "Error assigning subject", backgroundColor: "#ef4444" }).showToast();
        }
    }

    const handleDelete = async (id) => {
        try {
            const response = await fetch(API_URL, {
                method: 'POST',
                body: new URLSearchParams({ deleteSubt: "true", id: id }),
                headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
            });
            const res = await response.json();
            if (res.status) {
                Toastify({ text: res.message, backgroundColor: "#10b981" }).showToast();
                getSubt(manage.id, academic.id);
                getStaff();
            } else {
                Toastify({ text: res.message, backgroundColor: "#ef4444" }).showToast();
            }
        } catch (error) {
            Toastify({ text: "Error deletion failed", backgroundColor: "#ef4444" }).showToast();
        }
    }

    /* ================= EFFECTS ================= */
    useEffect(() => {
        getAcademic();
    }, []);

    useEffect(() => {
        getStaff();
    }, [academic]);

    return (
        <Box>
            <Box sx={{ mb: 3 }}>
                <Typography variant="h6" sx={{ fontWeight: 700, color: '#1e293b' }}>
                    Subject Allocations
                </Typography>
                <Typography variant="body2" color="textSecondary">
                    Current Academic Year: {academic.name} ({academic.term})
                </Typography>
            </Box>

            <Paper elevation={0} sx={{ borderRadius: 2, border: '1px solid #e2e8f0', overflow: 'hidden' }}>
                <TableContainer>
                    <Table>
                        <TableHead>
                            <TableRow sx={{ bgcolor: '#f8fafc' }}>
                                <TableCell>#</TableCell>
                                <TableCell>Teacher</TableCell>
                                <TableCell>Workload</TableCell>
                                <TableCell>Assigned Subjects</TableCell>
                                <TableCell align="right">Actions</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {rows.map((row, index) => (
                                <TableRow key={index} hover>
                                    <TableCell sx={{ color: '#64748b' }}>{index + 1}</TableCell>
                                    <TableCell sx={{ fontWeight: 600 }}>
                                        <Stack direction="row" alignItems="center" spacing={2}>
                                            <Avatar src="images/pro_file.jpg" sx={{ width: 30, height: 30 }} />
                                            <Typography variant="body2" fontWeight={600}>{row.username}</Typography>
                                        </Stack>
                                    </TableCell>
                                    <TableCell>
                                        <Chip label={`${row.subject_count} Subjects`} size="small" color={row.subject_count > 0 ? "primary" : "default"} variant="outlined" />
                                    </TableCell>
                                    <TableCell sx={{ color: '#64748b' }}>
                                        {row.subjects && row.subjects.length > 0 ? row.subjects.join(", ") : "None"}
                                    </TableCell>
                                    <TableCell align="right">
                                        <Button
                                            variant="outlined"
                                            size="small"
                                            startIcon={<SettingsIcon />}
                                            onClick={() => {
                                                setManage(row);
                                                setOpen({ ...open, add: true });
                                                getSubt(row.id, academic.id);
                                            }}
                                            sx={{ borderRadius: 2, textTransform: 'none' }}
                                        >
                                            Manage
                                        </Button>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </TableContainer>
            </Paper>

            {/* SUBJECT MANAGEMENT DRAWER */}
            <Drawer
                anchor="right"
                open={open.add}
                onClose={() => setOpen({ ...open, add: false })}
                PaperProps={{ sx: { width: { xs: '100%', sm: 600 } } }}
            >
                <Box sx={{ p: 3, display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid #f1f5f9' }}>
                    <Box>
                        <Typography variant="h6" fontWeight={700}>Manage Subjects</Typography>
                        <Typography variant="caption" color="textSecondary">Teacher: {manage.username}</Typography>
                    </Box>
                    <IconButton onClick={() => setOpen({ ...open, add: false })}><CloseIcon /></IconButton>
                </Box>

                <Box sx={{ p: 3 }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
                        <Button
                            variant="contained"
                            endIcon={<ArrowDropDownIcon />}
                            onClick={(e) => setAnchorEl(e.currentTarget)}
                            sx={{
                                textTransform: 'none',
                                background: 'linear-gradient(135deg, #6366f1 0%, #4f46e5 100%)'
                            }}
                        >
                            Assign New Subject
                        </Button>
                        <Menu
                            anchorEl={anchorEl}
                            open={formMenuOpen}
                            onClose={() => setAnchorEl(null)}
                        >
                            {[1, 2, 3, 4].map((f) => (
                                <MenuItem
                                    key={f}
                                    onClick={() => {
                                        setForm(f);
                                        setAnchorEl(null);
                                        setOpen({ ...open, addsub: true });
                                        getSubs();
                                    }}
                                >
                                    Form {f}
                                </MenuItem>
                            ))}
                        </Menu>
                    </Box>

                    <TableContainer component={Paper} variant="outlined" sx={{ borderRadius: 2 }}>
                        <Table size="small">
                            <TableHead sx={{ bgcolor: '#f8fafc' }}>
                                <TableRow>
                                    <TableCell>Subject</TableCell>
                                    <TableCell>Form</TableCell>
                                    <TableCell align="right">Remove</TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {subt.length === 0 ? (
                                    <TableRow>
                                        <TableCell colSpan={3} align="center" sx={{ py: 4, color: '#94a3b8' }}>No subjects assigned yet.</TableCell>
                                    </TableRow>
                                ) : (
                                    subt.map((row, index) => (
                                        <TableRow key={index}>
                                            <TableCell sx={{ fontWeight: 600 }}>{row.subject_data?.name || "Unknown"}</TableCell>
                                            <TableCell><Chip label={`Form ${row.form}`} size="small" /></TableCell>
                                            <TableCell align="right">
                                                <IconButton size="small" color="error" onClick={() => handleDelete(row.id)}>
                                                    <DeleteIcon fontSize="small" />
                                                </IconButton>
                                            </TableCell>
                                        </TableRow>
                                    ))
                                )}
                            </TableBody>
                        </Table>
                    </TableContainer>
                </Box>
            </Drawer>

            {/* ADD SUBJECT DIALOG */}
            <Dialog
                open={open.addsub}
                onClose={() => setOpen({ ...open, addsub: false })}
                PaperProps={{ sx: { borderRadius: 3, width: 400 } }}
            >
                <Box sx={{ p: 3, display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid #f1f5f9' }}>
                    <Typography variant="h6" fontWeight={700}>Assign Form {form} Subjects</Typography>
                    <IconButton onClick={() => setOpen({ ...open, addsub: false })} size="small"><CloseIcon /></IconButton>
                </Box>

                <Box sx={{ p: 0, maxHeight: 400, overflowY: 'auto' }}>
                    {subs.map((row, index) => (
                        <Box key={index} sx={{ px: 3, py: 1, borderBottom: '1px solid #f1f5f9' }}>
                            <FormControlLabel
                                control={
                                    <Checkbox
                                        onChange={() => select_subject(row)}
                                        color="primary"
                                    />
                                }
                                label={row.name}
                            />
                        </Box>
                    ))}
                </Box>

                <Box sx={{ p: 3, bgcolor: '#f8fafc' }}>
                    <Button
                        fullWidth
                        variant="contained"
                        onClick={() => {
                            setOpen({ ...open, addsub: false });
                            getSubt(manage.id, academic.id);
                            getStaff();
                        }}
                        sx={{ background: 'linear-gradient(135deg, #6366f1 0%, #4f46e5 100%)' }}
                    >
                        Done
                    </Button>
                    <Alert severity="info" sx={{ mt: 2, fontSize: 12 }}>
                        Checking a box instantly assigns the subject. Unchecking does NOT remove it (use delete in the main list).
                    </Alert>
                </Box>
            </Dialog>
        </Box>
    );
}

export default SubjectTeachers;
