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
    TextField,
    Paper,
    IconButton,
    InputAdornment,
    Chip,
    LinearProgress,
    Stack,
    TableContainer
} from '@mui/material';
import {
    Close as CloseIcon,
    Visibility as ViewIcon,
    Print as PrintIcon,
    School as SchoolIcon,
    Save as SaveIcon
} from '@mui/icons-material';
import Toastify from 'toastify-js';
import "toastify-js/src/toastify.css";

const API_URL = "https://unimarket-mw.com/smis-api/api/index.php";

function StaffHome() {
    const [sub, setSub] = useState([]);
    const [open, setOpen] = useState({ upload: false });
    const [info, setInfo] = useState({ status: "active" }); // Default to active or fetch actual status
    const [acaData, setAcaData] = useState({});
    const [rows, setRows] = useState([]);
    const [loading, setLoading] = useState(false);
    const [studentLoading, setStudentLoading] = useState(false);

    // Fetch Subjects for Teacher
    const getSubjects = async () => {
        setLoading(true);
        try {
            const res = await fetch(`${API_URL}?getSubjectsTeacher=true`);
            const data = await res.json();
            setSub(Array.isArray(data) ? data : []);
        } catch (error) {
            console.error("Error fetching subjects:", error);
            Toastify({ text: "Failed to load subjects", backgroundColor: "#ef4444" }).showToast();
        } finally {
            setLoading(false);
        }
    };

    // Fetch Upload Status Info
    const getInfo = async () => {
        try {
            const res = await fetch(`${API_URL}?getInfoUpload=true`);
            const text = await res.text();
            try {
                const data = JSON.parse(text);
                if (data.status) {
                    setInfo(data.data);
                }
            } catch (e) {
                console.error("Invalid JSON for info:", text);
            }
        } catch (error) {
            console.error("Error fetching info:", error);
        }
    };

    // Fetch Students for a specific Subject/Class
    const getYourStudents = async (form, aca_id, name, term, subId) => {
        setStudentLoading(true);
        setAcaData({ form, name, term, subject_id: subId, academic_id: aca_id });
        setOpen({ upload: true });
        setRows([]); // Clear previous rows while loading

        try {
            const params = new URLSearchParams({
                getYourStudents: "true",
                form: form,
                academic_id: aca_id,
                subject_id: subId
            });
            const res = await fetch(`${API_URL}?${params.toString()}`);
            const data = await res.json();
            setRows(Array.isArray(data) ? data : []);
        } catch (error) {
            console.error("Error fetching students:", error);
            Toastify({ text: "Failed to load student list", backgroundColor: "#ef4444" }).showToast();
        } finally {
            setStudentLoading(false);
        }
    };

    // Print Marks List
    const getYourStudentsMarks = (form, aca_id, name, term, subId) => {
        const params = new URLSearchParams({
            print_marks: "true",
            form: form,
            academic_id: aca_id,
            subject_id: subId
        });
        const url = `${API_URL}?${params.toString()}`;
        window.open(url, "_blank").focus();
    };

    // Update End Term Mark
    const updateMark = async (id, subject, form, academic_id, value) => {
        if (value === "" || value === null || value === undefined) return;
        if (value > 100 || value < 0) {
            Toastify({ text: "Mark must be between 0 and 100", backgroundColor: "#f59e0b" }).showToast();
            return;
        }

        try {
            const body = new URLSearchParams({
                updateEndTerm: "true",
                id: id,
                subject: subject,
                form: form,
                academic_id: academic_id,
                value: value
            });
            const response = await fetch(API_URL, {
                method: 'POST',
                body: body,
                headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
            });
            const res = await response.json();
            if (res.status) {
                Toastify({ text: res.message, backgroundColor: "#10b981", duration: 1000 }).showToast();
            } else {
                Toastify({ text: res.message, backgroundColor: "#ef4444" }).showToast();
            }
        } catch (error) {
            console.error("Error updating mark:", error);
            Toastify({ text: "Update failed", backgroundColor: "#ef4444" }).showToast();
        }
    };

    // Update Assessment Mark
    const updateAssessment = async (id, subject, form, academic_id, value) => {
        if (value === "" || value === null || value === undefined) return;
        if (value > 100 || value < 0) {
            Toastify({ text: "Mark must be between 0 and 100", backgroundColor: "#f59e0b" }).showToast();
            return;
        }

        try {
            const body = new URLSearchParams({
                updateAssessment: "true",
                id: id,
                subject: subject,
                form: form,
                academic_id: academic_id,
                value: value
            });
            const response = await fetch(API_URL, {
                method: 'POST',
                body: body,
                headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
            });
            const res = await response.json();
            if (res.status) {
                Toastify({ text: res.message, backgroundColor: "#10b981", duration: 1000 }).showToast();
            } else {
                Toastify({ text: res.message, backgroundColor: "#ef4444" }).showToast();
            }
        } catch (error) {
            console.error("Error updating assessment:", error);
            Toastify({ text: "Update failed", backgroundColor: "#ef4444" }).showToast();
        }
    };

    useEffect(() => {
        getSubjects();
        getInfo();
    }, []);

    return (
        <Box>
            <Box sx={{ mb: 3 }}>
                <Typography variant="h6" sx={{ fontWeight: 700, color: '#1e293b' }}>
                    My Classes & Grading
                </Typography>
                <Typography variant="body2" color="textSecondary">
                    View your assigned subjects and enter student marks.
                </Typography>
            </Box>

            <Paper elevation={0} sx={{ borderRadius: 2, border: '1px solid #e2e8f0', overflow: 'hidden' }}>
                <TableContainer>
                    <Table>
                        <TableHead>
                            <TableRow sx={{ bgcolor: '#f8fafc' }}>
                                <TableCell sx={{ fontWeight: 600, color: '#475569' }}>#</TableCell>
                                <TableCell sx={{ fontWeight: 600, color: '#475569' }}>Subject</TableCell>
                                <TableCell sx={{ fontWeight: 600, color: '#475569' }}>Academic Year</TableCell>
                                <TableCell sx={{ fontWeight: 600, color: '#475569' }}>Term</TableCell>
                                <TableCell sx={{ fontWeight: 600, color: '#475569' }}>Form</TableCell>
                                <TableCell align="right" sx={{ fontWeight: 600, color: '#475569' }}>Actions</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {loading ? (
                                <TableRow>
                                    <TableCell colSpan={6} sx={{ p: 0 }}>
                                        <LinearProgress sx={{ bgcolor: '#e0e7ff', '& .MuiLinearProgress-bar': { bgcolor: '#6366f1' } }} />
                                    </TableCell>
                                </TableRow>
                            ) : sub.length === 0 ? (
                                <TableRow>
                                    <TableCell colSpan={6} align="center" sx={{ py: 4, color: '#64748b' }}>
                                        No assigned subjects found.
                                    </TableCell>
                                </TableRow>
                            ) : (
                                sub.map((row, index) => (
                                    <TableRow key={index} hover>
                                        <TableCell sx={{ color: '#64748b' }}>{index + 1}</TableCell>
                                        <TableCell sx={{ fontWeight: 600 }}>
                                            <Stack direction="row" alignItems="center" spacing={1}>
                                                <SchoolIcon sx={{ fontSize: 16, color: '#6366f1' }} />
                                                <span>{row.subject_data?.name || "Unknown"}</span>
                                            </Stack>
                                        </TableCell>
                                        <TableCell>{row.academic_data?.name || "-"}</TableCell>
                                        <TableCell>{row.academic_data?.term || "-"}</TableCell>
                                        <TableCell>
                                            <Chip label={`Form ${row.form}`} size="small" sx={{ bgcolor: '#e0f2fe', color: '#0369a1', fontWeight: 600 }} />
                                        </TableCell>
                                        <TableCell align="right">
                                            <Stack direction="row" spacing={1} justifyContent="flex-end">
                                                <Button
                                                    variant="outlined"
                                                    size="small"
                                                    startIcon={<ViewIcon />}
                                                    onClick={() => getYourStudents(row.form, row.academic_id, row.academic_data?.name, row.academic_data?.term, row.subject_id)}
                                                    sx={{ borderRadius: 2, textTransform: 'none' }}
                                                >
                                                    View & Grade
                                                </Button>
                                                <Button
                                                    variant="outlined"
                                                    size="small"
                                                    color="success"
                                                    startIcon={<PrintIcon />}
                                                    onClick={() => getYourStudentsMarks(row.form, row.academic_id, row.academic_data?.name, row.academic_data?.term, row.subject_id)}
                                                    sx={{ borderRadius: 2, textTransform: 'none' }}
                                                >
                                                    Print
                                                </Button>
                                            </Stack>
                                        </TableCell>
                                    </TableRow>
                                ))
                            )}
                        </TableBody>
                    </Table>
                </TableContainer>
            </Paper>

            {/* UPLOAD / GRADING DIALOG */}
            <Dialog
                fullScreen
                open={open.upload}
                onClose={() => setOpen({ ...open, upload: false })}
                TransitionComponent={React.forwardRef(function Transition(props, ref) {
                    return <Box ref={ref} {...props} sx={{ transform: 'none' }} />; // Disable slide for simpler testing, or import Slide if desired
                })}
            >
                <Box sx={{ bgcolor: '#f8fafc', minHeight: '100vh' }}>
                    {/* Toolbar */}
                    <Paper elevation={0} sx={{
                        p: 2, px: 3, display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                        borderBottom: '1px solid #e2e8f0', position: 'sticky', top: 0, zIndex: 10
                    }}>
                        <Box>
                            <Typography variant="h6" fontWeight={700} sx={{ color: '#1e293b' }}>
                                Grading: {acaData.name} — Term {acaData.term}
                            </Typography>
                            <Typography variant="body2" color="textSecondary">
                                Form {acaData.form} • Class List
                            </Typography>
                        </Box>
                        <Stack direction="row" spacing={2} alignItems="center">
                            {info.status === "active" ? (
                                <Chip label="Grading Open" color="success" size="small" variant="flat" sx={{ bgcolor: '#dcfce7', color: '#15803d' }} />
                            ) : (
                                <Chip label="Grading Closed" color="error" size="small" variant="flat" sx={{ bgcolor: '#fee2e2', color: '#b91c1c' }} />
                            )}
                            <IconButton onClick={() => setOpen({ ...open, upload: false })} sx={{ bgcolor: '#f1f5f9', '&:hover': { bgcolor: '#e2e8f0' } }}>
                                <CloseIcon />
                            </IconButton>
                        </Stack>
                    </Paper>

                    {/* Content */}
                    <Box sx={{ p: 4, maxWidth: '1200px', mx: 'auto' }}>
                        {info.status === "active" ? (
                            <Paper elevation={0} sx={{ borderRadius: 3, border: '1px solid #e2e8f0', overflow: 'hidden' }}>
                                <TableContainer sx={{ maxHeight: '80vh' }}>
                                    <Table stickyHeader>
                                        <TableHead>
                                            <TableRow>
                                                <TableCell sx={{ bgcolor: '#f1f5f9', fontWeight: 700 }}>#</TableCell>
                                                <TableCell sx={{ bgcolor: '#f1f5f9', fontWeight: 700 }}>Student Name</TableCell>
                                                <TableCell sx={{ bgcolor: '#f1f5f9', fontWeight: 700, width: 200 }}>Assessment (40%)</TableCell>
                                                <TableCell sx={{ bgcolor: '#f1f5f9', fontWeight: 700, width: 200 }}>End of Term (60%)</TableCell>
                                            </TableRow>
                                        </TableHead>
                                        <TableBody>
                                            {studentLoading ? (
                                                <TableRow>
                                                    <TableCell colSpan={4} sx={{ p: 0 }}>
                                                        <LinearProgress />
                                                    </TableCell>
                                                </TableRow>
                                            ) : rows.length === 0 ? (
                                                <TableRow>
                                                    <TableCell colSpan={4} align="center" sx={{ py: 4, color: '#64748b' }}>
                                                        No students found for this class.
                                                    </TableCell>
                                                </TableRow>
                                            ) : (
                                                rows.map((row, index) => (
                                                    <TableRow key={index} hover>
                                                        <TableCell>{index + 1}</TableCell>
                                                        <TableCell sx={{ fontWeight: 600, color: '#334155' }}>
                                                            {row.student_data?.names || "Unknown"}
                                                        </TableCell>
                                                        <TableCell>
                                                            <TextField
                                                                size="small"
                                                                type="number"
                                                                defaultValue={row.assessment}
                                                                onBlur={e => updateAssessment(row.id, acaData.subject_id, acaData.form, acaData.academic_id, e.target.value)}
                                                                fullWidth
                                                                InputProps={{
                                                                    endAdornment: <InputAdornment position="end">%</InputAdornment>,
                                                                }}
                                                                sx={{ bgcolor: '#fff' }}
                                                            />
                                                        </TableCell>
                                                        <TableCell>
                                                            <TextField
                                                                size="small"
                                                                type="number"
                                                                defaultValue={row.end_term}
                                                                onBlur={e => updateMark(row.id, acaData.subject_id, acaData.form, acaData.academic_id, e.target.value)}
                                                                fullWidth
                                                                InputProps={{
                                                                    endAdornment: <InputAdornment position="end">%</InputAdornment>,
                                                                }}
                                                                sx={{ bgcolor: '#fff' }}
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
                            <Box sx={{ textAlign: 'center', py: 10 }}>
                                <Typography variant="h5" fontWeight={700} color="error" gutterBottom>
                                    Grading Period is Closed
                                </Typography>
                                <Typography color="textSecondary">
                                    You cannot upload or edit marks at this time. Please contact the administrator.
                                </Typography>
                            </Box>
                        )}
                    </Box>
                </Box>
            </Dialog>
        </Box>
    );
}

export default StaffHome;
