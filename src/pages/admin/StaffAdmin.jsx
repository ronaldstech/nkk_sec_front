import React, { useState, useEffect, useContext } from 'react';
import {
    Box,
    Button,
    Typography,
    Grid,
    Paper,
    Fade,
    Stack
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

import StaffTable from './components/StaffTable';
import StaffAddDialog from './components/StaffAddDialog';
import StaffEditDrawer from './components/StaffEditDrawer';
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

/* =======================
   MAIN COMPONENT
======================= */
function StaffAdmin() {
    const [open, setOpen] = useState({ add: false, edit: false });
    const [active, setActive] = useState({});
    const [rows, setRows] = useState([]);
    const [search, setSearch] = useState("");
    const [loading, setLoading] = useState(false);
    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(10);
    const { user } = useContext(AppContext);

    const isReadOnly = !user?.isAdmin;

    /* ===== DERIVED STATS ===== */
    const totalStaff = rows.length;
    const activeStaff = rows.filter(r => r.status === 'active').length;
    const inactiveStaff = totalStaff - activeStaff;

    /* ===== FETCH STAFF ===== */
    const getStaff = async () => {
        setLoading(true);
        try {
            const res = await fetch(`${API_URL}?getStaff=true`);
            const data = await res.json();
            if (Array.isArray(data)) setRows(data);
        } catch (err) {
            Toastify({
                text: "Failed to load staff data",
                backgroundColor: "#ef4444",
                duration: 3000
            }).showToast();
        } finally {
            setLoading(false);
        }
    };

    /* ===== UPDATE STAFF ===== */
    const handleUpdateStaff = async (e) => {
        e.preventDefault();
        const formData = new FormData(e.target);

        try {
            const res = await fetch(API_URL, {
                method: "POST",
                body: formData
            });
            const data = await res.json();

            if (data.status) {
                Toastify({
                    text: data.message || "Updated successfully",
                    backgroundColor: "#10b981",
                    duration: 3000
                }).showToast();
                setOpen({ ...open, edit: false });
                getStaff();
            } else {
                Toastify({
                    text: data.message || "Update failed",
                    backgroundColor: "#ef4444",
                    duration: 3000
                }).showToast();
            }
        } catch (err) {
            Toastify({
                text: "An error occurred. Please try again.",
                backgroundColor: "#ef4444",
                duration: 3000
            }).showToast();
        }
    };

    /* ===== UPDATE STATUS ===== */
    const handleStatusUpdate = async (staffId, newStatus) => {
        const formData = new FormData();
        formData.append('staff_id', staffId);
        formData.append('status', newStatus);

        try {
            const res = await fetch(API_URL, {
                method: "POST",
                body: formData
            });
            const data = await res.json();

            if (data.status) {
                Toastify({
                    text: data.message || "Status updated successfully",
                    backgroundColor: "#10b981",
                    duration: 3000
                }).showToast();
                getStaff();
            } else {
                Toastify({
                    text: data.message || "Failed to update status",
                    backgroundColor: "#ef4444",
                    duration: 3000
                }).showToast();
            }
        } catch (err) {
            Toastify({
                text: "An error occurred. Please try again.",
                backgroundColor: "#ef4444",
                duration: 3000
            }).showToast();
        }
    };

    useEffect(() => {
        getStaff();
    }, []);

    return (
        <Fade in timeout={600}>
            <Box
                sx={{
                    minHeight: '100vh',
                    backgroundColor: '#f8fafc',
                    px: { xs: 0, md: 1 },
                    py: { xs: 0, md: 1 }
                }}
            >

                {/* ================= HEADER (STICKY) ================= */}
                <Paper
                    elevation={0}
                    sx={{
                        position: { xs: 'relative', md: 'sticky' },
                        top: 0,
                        zIndex: 1100,
                        mb: { xs: 2, md: 4 },
                        p: { xs: 1, md: 2 },
                        borderRadius: 0,
                        borderBottom: '1px solid #e2e8f0',
                        background: 'linear-gradient(180deg,#ffffff,#f8fafc)',
                        backdropFilter: 'blur(8px)'
                    }}
                >
                    <Stack
                        direction={{ xs: 'column', md: 'row' }}
                        spacing={{ xs: 1, md: 2 }}
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
                                Staff Directory
                            </Typography>
                            <Typography sx={{ color: '#64748b', fontSize: 13 }}>
                                Manage team members, roles, and access
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
                                onClick={() => window.print()}
                                sx={{
                                    borderRadius: 2,
                                    textTransform: 'none',
                                    borderColor: '#e2e8f0'
                                }}
                            >
                                Export
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
                                    Add Staff
                                </Button>
                            )}
                        </Stack>
                    </Stack>
                </Paper>


                {/* ================= STATS ================= */}
                <Grid container spacing={{ xs: 1, md: 2 }} sx={{ mb: { xs: 2, md: 4 } }}>
                    <Grid item xs={12} sm={4}>
                        <StatCard
                            title="Total Members"
                            count={totalStaff}
                            icon={<PeopleIcon />}
                            color="#6366f1"
                        />
                    </Grid>
                    <Grid item xs={12} sm={4}>
                        <StatCard
                            title="Active"
                            count={activeStaff}
                            icon={<ActiveIcon />}
                            color="#10b981"
                        />
                    </Grid>
                    <Grid item xs={12} sm={4}>
                        <StatCard
                            title="Inactive"
                            count={inactiveStaff}
                            icon={<InactiveIcon />}
                            color="#ef4444"
                        />
                    </Grid>
                </Grid>

                {/* ================= TABLE ================= */}
                <Paper
                    elevation={0}
                    sx={{
                        borderRadius: 2,
                        border: '1px solid #e2e8f0',
                        overflow: 'hidden'
                    }}
                >
                    <Box sx={{ overflowX: 'auto' }}>
                        <StaffTable
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
                            onEditClick={(staff) => {
                                setActive(staff);
                                setOpen({ ...open, edit: true });
                            }}
                            readOnly={isReadOnly}
                        />
                    </Box>
                </Paper>

                {/* ================= DIALOGS ================= */}
                <StaffAddDialog
                    open={open.add}
                    onClose={() => setOpen({ ...open, add: false })}
                    onSave={getStaff}
                />

                <StaffEditDrawer
                    open={open.edit}
                    activeStaff={active}
                    onClose={() => setOpen({ ...open, edit: false })}
                    onUpdate={handleUpdateStaff}
                    onActivate={handleStatusUpdate}
                />
            </Box>
        </Fade>
    );
}

export default StaffAdmin;
