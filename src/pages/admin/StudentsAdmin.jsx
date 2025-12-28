import React, { useState, useEffect, useContext } from 'react';
import {
    Box,
    Fade,
    Paper,
    Typography,
    Stack,
    Button,
    Grid
} from '@mui/material';
import {
    PersonAdd as PersonAddIcon,
    Print as PrintIcon,
    PeopleAlt as PeopleIcon,
    CheckCircle as ActiveIcon,
    Cancel as InactiveIcon
} from '@mui/icons-material';
import Toastify from 'toastify-js';
import "toastify-js/src/toastify.css";

import StudentTable from './components/StudentTable';
import StudentAddDialog from './components/StudentAddDialog';
import StudentEditDrawer from './components/StudentEditDrawer';
import StudentDeleteDialog from './components/StudentDeleteDialog';
import { AppContext } from '../../context/AppContext';

const API_URL = "https://unimarket-mw.com/smis-api/api/index.php";

/* =======================
   STAT CARD COMPONENT
======================= */
const StatCard = ({ title, count, icon, color }) => (
    <Paper
        elevation={0}
        sx={{
            p: 1,
            borderRadius: 2,
            border: '1px solid #e2e8f0',
            display: 'flex',
            alignItems: 'center',
            gap: 1,
            transition: 'all .25s ease',
            '&:hover': {
                transform: 'translateY(-2px)',
                boxShadow: '0 10px 30px rgba(0,0,0,.06)'
            }
        }}
    >
        <Box
            sx={{
                width: 48,
                height: 48,
                borderRadius: 2,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                backgroundColor: `${color}20`,
                color
            }}
        >
            {icon}
        </Box>

        <Box>
            <Typography
                variant="caption"
                sx={{
                    fontWeight: 700,
                    color: '#64748b',
                    letterSpacing: '.06em',
                    textTransform: 'uppercase'
                }}
            >
                {title}
            </Typography>
            <Typography
                variant="h5"
                sx={{ fontWeight: 800, color: '#0f172a' }}
            >
                {count}
            </Typography>
        </Box>
    </Paper>
);

function StudentsAdmin() {
    const { user } = useContext(AppContext);
    const isReadOnly = !user?.isAdmin;

    const [open, setOpen] = useState({
        add: false,
        edit: false,
        delet: false
    });

    const [rows, setRows] = useState([]);
    const [active, setActive] = useState({});
    const [search, setSearch] = useState("");
    const [loading, setLoading] = useState(false);
    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(10);

    /* ===== DERIVED STATS ===== */
    const totalStudents = rows.length;
    const activeStudents = rows.filter(r => r.status === 'active').length;
    const inactiveStudents = totalStudents - activeStudents;

    /* ===== FETCH DATA ===== */
    const getStudents = async () => {
        setLoading(true);
        try {
            const res = await fetch(`${API_URL}?getStudents=true`);
            const data = await res.json();
            if (Array.isArray(data)) {
                setRows(data);
            } else {
                setRows([]);
                console.error("Invalid student data:", data);
                Toastify({ text: "Failed to load student data", backgroundColor: "#ef4444" }).showToast();
            }
        } catch (error) {
            console.error(error);
            Toastify({ text: "Connection error", backgroundColor: "#ef4444" }).showToast();
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        getStudents();
    }, []);

    /* ===== HANDLERS ===== */
    const handleFormSubmit = async (event, action) => {
        event.preventDefault();
        const formData = new FormData(event.target);
        const body = new URLSearchParams(formData);

        try {
            const response = await fetch(API_URL, {
                method: 'POST',
                body: body,
                headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
            });
            const text = await response.text();
            let res;
            try {
                res = JSON.parse(text);
            } catch (e) {
                console.error("Server Error:", text);
                throw new Error("Invalid server response");
            }

            if (res.status) {
                Toastify({
                    text: action === 'add' ? "Student Added!" : "Student Updated!",
                    backgroundColor: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)"
                }).showToast();
                setOpen(prev => ({ ...prev, [action]: false }));
                getStudents();
                if (action === 'add') event.target.reset();
            } else {
                Toastify({ text: res.message || "Error occurred", backgroundColor: "#ef4444" }).showToast();
            }
        } catch (error) {
            Toastify({ text: error.message, backgroundColor: "#ef4444" }).showToast();
        }
    };

    const saveStudent = (e) => handleFormSubmit(e, 'add');
    const updateStudent = (e) => handleFormSubmit(e, 'edit');

    const activate = async (id, status) => {
        try {
            const body = new URLSearchParams({ student_id: id, status_edit: status });
            const response = await fetch(API_URL, {
                method: 'POST',
                body: body,
                headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
            });
            const res = await response.json();

            if (res.status) {
                Toastify({
                    text: status === "active" ? "Activated!" : "Deactivated!",
                    backgroundColor: "linear-gradient(135deg, #10b981 0%, #059669 100%)"
                }).showToast();
                getStudents();
            } else {
                Toastify({ text: res.message, backgroundColor: "#ef4444" }).showToast();
            }
        } catch (error) {
            Toastify({ text: "Error updating status", backgroundColor: "#ef4444" }).showToast();
        }
    }

    const deleteStudent = async (id) => {
        try {
            const body = new URLSearchParams({ student_id: id, deleteStudent: true });
            const response = await fetch(API_URL, {
                method: 'POST',
                body: body,
                headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
            });
            const res = await response.json();

            if (res.status) {
                Toastify({ text: "Deleted Successfully", backgroundColor: "#64748b" }).showToast();
                setOpen({ ...open, delet: false });
                getStudents();
            } else {
                Toastify({ text: res.message, backgroundColor: "#ef4444" }).showToast();
            }
        } catch (error) {
            Toastify({ text: "Error deleting student", backgroundColor: "#ef4444" }).showToast();
        }
    }

    const print = () => {
        window.open("api/index.php?print_students", "_blank")?.focus();
    }

    return (
        <Fade in timeout={600}>
            <Box
                sx={{
                    minHeight: '100vh',
                    backgroundColor: '#f8fafc',
                    px: { xs: 1, md: 2 },
                    py: { xs: 1, md: 2 }
                }}
            >
                {/* ================= HEADER (STICKY) ================= */}
                <Paper
                    elevation={0}
                    sx={{
                        position: 'sticky',
                        top: 0,
                        zIndex: 1100,
                        mb: 4,
                        p: { xs: 1, md: 2 },
                        borderRadius: 0,
                        borderBottom: '1px solid #e2e8f0',
                        background: 'linear-gradient(180deg,#ffffff,#f8fafc)',
                        backdropFilter: 'blur(8px)'
                    }}
                >
                    <Stack
                        direction={{ xs: 'column', md: 'row' }}
                        spacing={2}
                        justifyContent="space-between"
                        alignItems={{ xs: 'stretch', md: 'center' }}
                    >
                        <Box>
                            <Typography
                                sx={{
                                    fontSize: { xs: '1.25rem', md: '1.75rem' },
                                    fontWeight: 900,
                                    color: '#0f172a'
                                }}
                            >
                                Students Directory
                            </Typography>
                            <Typography sx={{ color: '#64748b', fontSize: 13 }}>
                                Manage enrolled students, records, and status
                            </Typography>
                        </Box>

                        <Stack
                            direction={{ xs: 'column', sm: 'row' }}
                            spacing={1}
                        >
                            <Button
                                fullWidth
                                variant="outlined"
                                startIcon={<PrintIcon />}
                                onClick={print}
                                sx={{ borderRadius: 2, textTransform: 'none', borderColor: '#e2e8f0' }}
                            >
                                Export PDF
                            </Button>

                            {!isReadOnly && (
                                <Button
                                    fullWidth
                                    variant="contained"
                                    startIcon={<PersonAddIcon />}
                                    onClick={() => setOpen({ ...open, add: true })}
                                    sx={{
                                        borderRadius: 2,
                                        textTransform: 'none',
                                        px: 3,
                                        background: 'linear-gradient(135deg,#6366f1,#4f46e5)',
                                        boxShadow: '0 6px 20px rgba(79,70,229,.35)'
                                    }}
                                >
                                    Add Student
                                </Button>
                            )}
                        </Stack>
                    </Stack>
                </Paper>

                {/* ================= STATS ================= */}
                <Grid container spacing={2} sx={{ mb: 4 }}>
                    <Grid item xs={12} sm={4}>
                        <StatCard
                            title="Total Students"
                            count={totalStudents}
                            icon={<PeopleIcon />}
                            color="#6366f1"
                        />
                    </Grid>
                    <Grid item xs={12} sm={4}>
                        <StatCard
                            title="Active"
                            count={activeStudents}
                            icon={<ActiveIcon />}
                            color="#10b981"
                        />
                    </Grid>
                    <Grid item xs={12} sm={4}>
                        <StatCard
                            title="Inactive"
                            count={inactiveStudents}
                            icon={<InactiveIcon />}
                            color="#ef4444"
                        />
                    </Grid>
                </Grid>

                {/* ================= TABLE ================= */}
                <Box sx={{ overflowX: 'auto' }}>
                    <StudentTable
                        rows={rows}
                        loading={loading}
                        page={page}
                        rowsPerPage={rowsPerPage}
                        search={search}
                        onSearchChange={(e) => setSearch(e.target.value)}
                        onPageChange={(e, p) => setPage(p)}
                        onRowsPerPageChange={(e) => {
                            setRowsPerPage(parseInt(e.target.value, 10));
                            setPage(0);
                        }}
                        onEditClick={(student) => {
                            setActive(student);
                            setOpen({ ...open, edit: true });
                        }}
                        onDeleteClick={(student) => {
                            setActive(student);
                            setOpen({ ...open, delet: true });
                        }}
                        readOnly={isReadOnly}
                    />
                </Box>

                {/* ================= DIALOGS ================= */}
                <StudentAddDialog
                    open={open.add}
                    onClose={() => setOpen({ ...open, add: false })}
                    onSave={saveStudent}
                />

                <StudentEditDrawer
                    open={open.edit}
                    onClose={() => setOpen({ ...open, edit: false })}
                    activeStudent={active}
                    onUpdate={updateStudent}
                    onActivate={activate}
                />

                <StudentDeleteDialog
                    open={open.delet}
                    onClose={() => setOpen({ ...open, delet: false })}
                    onConfirm={() => deleteStudent(active.id)}
                    studentName={`${active.first} ${active.last}`}
                />

            </Box>
        </Fade>
    );
}

export default StudentsAdmin;


