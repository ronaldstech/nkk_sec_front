import React, { useState, useEffect, useContext } from 'react';
import { AppContext } from '../../context/AppContext';
import {
    Box, Typography, Table, TableHead, TableRow, TableCell,
    TableBody, Stack, Paper, TableContainer, IconButton, Chip, Avatar, Tooltip, LinearProgress,
    useTheme, useMediaQuery
} from '@mui/material';
import {
    Settings as SettingsIcon, School as SchoolIcon
} from '@mui/icons-material';
import Toastify from 'toastify-js';
import "toastify-js/src/toastify.css";

import TeacherManagementDrawer from './components/TeacherManagementDrawer';
import AssignSubjectDialog from './components/AssignSubjectDialog';

const API_URL = "https://unimarket-mw.com/smis-api/api/index.php";

function SubjectTeachers({ readOnly = false }) {
    const { schoolType } = useContext(AppContext);
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
    const [rows, setRows] = useState([]);
    const [academic, setAcademic] = useState({ id: 0, name: "Loading...", term: "" });
    const [open, setOpen] = useState({ add: false, addsub: false });
    const [manage, setManage] = useState({});
    const [subs, setSubs] = useState([]);
    const [subt, setSubt] = useState([]);
    const [form, setForm] = useState(0);
    const [loading, setLoading] = useState(false);
    const [subtLoading, setSubtLoading] = useState(false);

    /* ================= DATA FETCHING ================= */
    const getAcademic = async () => {
        const res = await fetch(`${API_URL}?getAcademic=true&school_type=${schoolType}`);
        const data = await res.json();
        setAcademic(data);
    };

    const getStaff = async () => {
        if (!academic.id) return;
        setLoading(true);
        try {
            const res = await fetch(`${API_URL}?getStaffA=${academic.id}&school_type=${schoolType}`);
            const data = await res.json();
            setRows(data);
        } catch (error) {
            console.error("Error fetching staff:", error);
        } finally {
            setLoading(false);
        }
    };

    const getSubs = async () => {
        const res = await fetch(`${API_URL}?getSubs=true`);
        const data = await res.json();
        setSubs(data);
    };

    const getSubt = async (teacherId, academicId) => {
        setSubtLoading(true);
        try {
            const res = await fetch(`${API_URL}?getSubt=true&academic_id=${academicId}&teacher_id=${teacherId}`);
            const data = await res.json();
            setSubt(data);
        } catch (error) {
            console.error("Error fetching teacher subjects:", error);
        } finally {
            setSubtLoading(false);
        }
    };

    /* ================= ACTIONS ================= */
    const select_subject = async (subj) => {
        const body = new URLSearchParams({
            teacher_id: manage.id, subject_id: subj.id,
            form: form, academic_id: academic.id
        });
        const response = await fetch(API_URL, { method: 'POST', body: body });
        const res = await response.json();
        Toastify({ text: res.message, backgroundColor: "#4f46e5" }).showToast();
        getSubt(manage.id, academic.id);
        getStaff();
    }

    const handleDelete = async (id) => {
        const response = await fetch(API_URL, {
            method: 'POST',
            body: new URLSearchParams({ deleteSubt: "true", id: id })
        });
        const res = await response.json();
        if (res.status) {
            Toastify({ text: res.message, backgroundColor: "#ef4444" }).showToast();
            getSubt(manage.id, academic.id);
            getStaff();
        }
    }

    // Handler to open the assign dialog (passed to drawer)
    const handleAssignNew = (selectedForm) => {
        setForm(selectedForm);
        setOpen({ ...open, addsub: true });
        getSubs();
    };

    useEffect(() => { getAcademic(); }, [schoolType]);
    useEffect(() => { getStaff(); }, [academic, schoolType]);

    return (
        <Box>
            {/* Header Section */}
            <Box sx={{ mb: { xs: 2, md: 4 }, display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', px: { xs: 1, md: 0 } }}>
                <Box>
                    <Typography variant="h5" sx={{ fontWeight: 800, color: '#0f172a', letterSpacing: '-0.5px' }}>
                        Teacher Allocations
                    </Typography>
                    <Stack direction="row" spacing={1} alignItems="center" sx={{ mt: 0.5 }}>
                        <SchoolIcon sx={{ fontSize: 16, color: '#6366f1' }} />
                        <Typography variant="body2" sx={{ color: '#64748b', fontWeight: 500 }}>
                            {academic.name} — Term {academic.term}
                        </Typography>
                    </Stack>
                </Box>
                <Chip
                    label="Active Session"
                    size="small"
                    sx={{ bgcolor: '#ecfdf5', color: '#059669', fontWeight: 700, borderRadius: '6px' }}
                />
            </Box>

            <TableContainer component={Paper} elevation={0} sx={{ borderRadius: 2, border: '1px solid #e2e8f0' }}>
                <Table>
                    <TableHead>
                        <TableRow sx={{ bgcolor: '#f8fafc' }}>
                            <TableCell sx={{ fontWeight: 700, color: '#475569' }}>Teacher</TableCell>
                            {!isMobile && <TableCell sx={{ fontWeight: 700, color: '#475569' }}>Workload</TableCell>}
                            <TableCell sx={{ fontWeight: 700, color: '#475569' }}>Subjects</TableCell>
                            {!readOnly && <TableCell align="right" sx={{ fontWeight: 700, color: '#475569' }}>Actions</TableCell>}
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {loading ? (
                            <TableRow>
                                <TableCell colSpan={4} sx={{ p: 0 }}>
                                    <LinearProgress sx={{ bgcolor: '#e0e7ff', '& .MuiLinearProgress-bar': { bgcolor: '#6366f1' } }} />
                                </TableCell>
                            </TableRow>
                        ) : (
                            rows.map((row, index) => (
                                <TableRow key={index} hover sx={{ '&:last-child td, &:last-child th': { border: 0 } }}>
                                    <TableCell>
                                        <Stack direction="row" alignItems="center" spacing={2}>
                                            {!isMobile && (<Avatar
                                                sx={{
                                                    width: 40, height: 40,
                                                    bgcolor: '#f1f5f9', color: '#6366f1',
                                                    fontSize: '1rem', fontWeight: 700,
                                                    border: '2px solid #fff',
                                                    boxShadow: '0 2px 4px rgba(0,0,0,0.05)'
                                                }}
                                            >
                                                {row.username.charAt(0)}
                                            </Avatar>)}
                                            <Box>
                                                <Typography variant="body2" sx={{ fontWeight: 700, color: '#1e293b' }}>
                                                    {row.username}
                                                </Typography>
                                                <Typography variant="caption" sx={{ color: '#94a3b8' }}>
                                                    Staff ID: #00{row.id}
                                                </Typography>
                                            </Box>
                                        </Stack>
                                    </TableCell>
                                    {!isMobile && (
                                        <TableCell sx={{ minWidth: 150 }}>
                                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                                <Box sx={{ width: '100%', mr: 1 }}>
                                                    <LinearProgress
                                                        variant="determinate"
                                                        value={Math.min((row.subject_count / 8) * 100, 100)}
                                                        sx={{
                                                            height: 6, borderRadius: 5, bgcolor: '#f1f5f9',
                                                            '& .MuiLinearProgress-bar': { borderRadius: 5, bgcolor: row.subject_count > 6 ? '#f59e0b' : '#6366f1' }
                                                        }}
                                                    />
                                                </Box>
                                                <Typography variant="caption" fontWeight={700} color="textSecondary">
                                                    {row.subject_count}
                                                </Typography>
                                            </Box>
                                        </TableCell>
                                    )}
                                    <TableCell>
                                        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                                            {row.subjects && row.subjects.length > 0 ? (
                                                row.subjects.map((s, i) => (
                                                    <Chip
                                                        key={s.id || i}
                                                        label={s.name}
                                                        size="small"
                                                        sx={{ fontSize: '0.65rem', height: 20, bgcolor: '#f8fafc', border: '1px solid #e2e8f0' }}
                                                    />
                                                ))
                                            ) : (
                                                <Typography variant="caption" italic color="#cbd5e1">No assignments</Typography>
                                            )}
                                        </Box>
                                    </TableCell>
                                    {!readOnly && (
                                        <TableCell align="right">
                                            <Tooltip title="Manage Schedule">
                                                <IconButton
                                                    onClick={() => {
                                                        setManage(row);
                                                        setOpen({ ...open, add: true });
                                                        getSubt(row.id, academic.id);
                                                    }}
                                                    sx={{ color: '#6366f1', bgcolor: '#f5f3ff', '&:hover': { bgcolor: '#e0e7ff' } }}
                                                >
                                                    <SettingsIcon fontSize="small" />
                                                </IconButton>
                                            </Tooltip>
                                        </TableCell>
                                    )}
                                </TableRow>
                            ))
                        )}
                    </TableBody>
                </Table>
            </TableContainer>

            <TeacherManagementDrawer
                open={open.add}
                onClose={() => setOpen({ ...open, add: false })}
                teacher={manage}
                subjects={subt}
                loading={subtLoading}
                onDelete={handleDelete}
                onAssignNew={handleAssignNew}
            />

            <AssignSubjectDialog
                open={open.addsub}
                onClose={() => setOpen({ ...open, addsub: false })}
                form={form}
                subjects={subs}
                onSelect={select_subject}
                onSave={() => { setOpen({ ...open, addsub: false }); getStaff(); }}
            />
        </Box>
    );
}

export default SubjectTeachers;