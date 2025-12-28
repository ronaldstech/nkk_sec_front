import React, { useContext, useState, useEffect } from 'react';
import {
    Box,
    Typography,
    Grid,
    Paper,
    CircularProgress,
    Button,
    Stack,
    Divider,
    Avatar
} from '@mui/material';
import { AppContext } from '../../context/AppContext';
import {
    School as SchoolIcon,
    Class as ClassIcon,
    Assignment as AssignmentIcon,
    ArrowForwardIos as ArrowIcon,
    TrendingUp as TrendingUpIcon,
    EventNote as EventIcon,
    Add as AddIcon,
    Campaign as CampaignIcon
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';

/* ---------------------- Stat Card ---------------------- */
const StatCard = ({ title, value, icon, color, loading, trend, onClick }) => (
    <Paper
        elevation={0}
        onClick={onClick}
        sx={{
            p: { xs: 2.5, md: 3 },
            height: '100%',
            borderRadius: '24px',
            background:
                'linear-gradient(180deg, rgba(255,255,255,0.88), rgba(255,255,255,0.7))',
            backdropFilter: 'blur(18px)',
            border: '1px solid rgba(0,0,0,0.05)',
            transition: 'all 0.3s ease',
            cursor: onClick ? 'pointer' : 'default',
            '&:hover': {
                transform: { md: 'translateY(-8px)' },
                boxShadow: '0 25px 50px rgba(0,0,0,0.12)'
            }
        }}
    >
        <Stack direction="row" justifyContent="space-between" alignItems="flex-start">
            <Box>
                <Typography
                    variant="overline"
                    sx={{
                        fontWeight: 700,
                        letterSpacing: 1.2,
                        color: 'text.secondary'
                    }}
                >
                    {title}
                </Typography>

                {loading ? (
                    <CircularProgress
                        size={24}
                        thickness={5}
                        sx={{ color: color.split(',')[0], mt: 1 }}
                    />
                ) : (
                    <>
                        <Typography
                            sx={{
                                fontWeight: 900,
                                my: 0.5,
                                fontSize: { xs: '2rem', md: '2.8rem' },
                                background: `linear-gradient(135deg, ${color})`,
                                WebkitBackgroundClip: 'text',
                                WebkitTextFillColor: 'transparent'
                            }}
                        >
                            {value}
                        </Typography>
                        <Typography
                            variant="caption"
                            sx={{
                                color: '#16a34a',
                                fontWeight: 700
                            }}
                        >
                            {trend}
                        </Typography>
                    </>
                )}
            </Box>

            <Box
                sx={{
                    p: { xs: 1.2, md: 1.6 },
                    borderRadius: '16px',
                    background: `linear-gradient(135deg, ${color})`,
                    color: '#fff'
                }}
            >
                {React.cloneElement(icon, { fontSize: 'medium' })}
            </Box>
        </Stack>
    </Paper>
);

const API_URL = "https://unimarket-mw.com/smis-api/api/index.php";

function StaffDashboard() {
    const { user, academic } = useContext(AppContext);
    const navigate = useNavigate();

    const [loading, setLoading] = useState(true);
    const [sub, setSub] = useState([]);
    const [info, setInfo] = useState({ status: "inactive" });

    const getSubjects = async () => {
        if (!user.id || !academic.id) return;
        try {
            const params = new URLSearchParams({
                getSubt: "true",
                academic_id: academic.id,
                teacher_id: user.id
            });
            const res = await fetch(`${API_URL}?${params.toString()}`);
            const data = await res.json();
            setSub(Array.isArray(data) ? data : []);
        } catch (error) {
            console.error("Error fetching subjects:", error);
        }
    };

    const getInfo = async () => {
        try {
            const res = await fetch(`${API_URL}?getInfoUpload=true`);
            const data = await res.json();
            if (data.status) {
                setInfo(data.data);
            }
        } catch (error) {
            console.error("Error fetching info:", error);
        }
    };

    useEffect(() => {
        const fetchData = async () => {
            setLoading(true);
            await Promise.all([getSubjects(), getInfo()]);
            setLoading(false);
        };
        fetchData();
    }, [user.id, academic.id]);

    return (
        <Box sx={{ p: { xs: 2, md: 4 } }}>
            {/* Header */}
            <Stack
                direction={{ xs: 'column', sm: 'row' }}
                spacing={2}
                alignItems={{ xs: 'flex-start', sm: 'flex-end' }}
                justifyContent="space-between"
                sx={{ mb: 4 }}
            >
                <Box>
                    <Typography
                        sx={{
                            fontWeight: 900,
                            fontSize: { xs: '2rem', md: '2.6rem' }
                        }}
                    >
                        Staff Portal
                    </Typography>
                    <Typography color="text.secondary">
                        Welcome back, {user.username || 'Staff'}. Ready to teach?
                    </Typography>
                </Box>

                <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '12px',
                    background: 'rgba(255,255,255,0.5)',
                    padding: '8px 16px',
                    borderRadius: '12px',
                    border: '1px solid rgba(0,0,0,0.05)'
                }}>
                    <Typography variant="body2" fontWeight={600} color="text.secondary">
                        {academic.name}:
                    </Typography>
                    <Typography variant="body2" fontWeight={800} color="primary">
                        Term {academic.term}
                    </Typography>
                </div>
            </Stack>

            {/* Stats Cards */}
            <Grid container spacing={2.5} sx={{ mb: 4 }}>
                <Grid item xs={12} sm={6} lg={4}>
                    <StatCard
                        title="Total Classes"
                        value={sub.length}
                        icon={<ClassIcon />}
                        color="#6366f1, #a855f7"
                        loading={loading}
                        trend="Assigned this term"
                        onClick={() => navigate('/portal/staff/my-classes')}
                    />
                </Grid>
                <Grid item xs={12} sm={6} lg={4}>
                    <StatCard
                        title="Average Load"
                        value={`${Math.round(sub.length * 1.5)}h`}
                        icon={<TrendingUpIcon />}
                        color="#ec4899, #f43f5e"
                        loading={loading}
                        trend="Weekly Periods"
                    />
                </Grid>
                <Grid item xs={12} sm={6} lg={4}>
                    <StatCard
                        title="Grading Access"
                        value={info.status === "active" ? "Enabled" : "Locked"}
                        icon={<AssignmentIcon />}
                        color={info.status === "active" ? "#10b981, #059669" : "#64748b, #475569"}
                        loading={loading}
                        trend={info.status === "active" ? "Ready for data entry" : "Administrator locked"}
                        onClick={() => navigate('/portal/staff/my-classes')}
                    />
                </Grid>
            </Grid>

            <Grid container spacing={3}>
                {/* Recent Activity / Schedule */}
                <Grid item xs={12} md={7}>
                    <Paper
                        elevation={0}
                        sx={{
                            p: { xs: 2.5, md: 4 },
                            borderRadius: '24px',
                            background: 'rgba(255,255,255,0.9)',
                            border: '1px solid rgba(0,0,0,0.05)',
                            height: '100%'
                        }}
                    >
                        <Stack direction="row" justifyContent="space-between" mb={3}>
                            <Typography fontWeight={800}>Today's Schedule</Typography>
                            <Button size="small" endIcon={<ArrowIcon sx={{ fontSize: 12 }} />}>
                                View Calendar
                            </Button>
                        </Stack>

                        {[
                            { subject: 'Mathematics', class: 'Form 4B', time: '08:00 AM - 09:30 AM', color: '#6366f1' },
                            { subject: 'Physics', class: 'Form 3A', time: '10:00 AM - 11:30 AM', color: '#10b981' },
                            { subject: 'Free Period', class: 'Staff Room', time: '11:30 AM - 12:30 PM', color: '#f59e0b' }
                        ].map((item, i) => (
                            <Box key={i}>
                                <Stack direction="row" spacing={2} mb={2} alignItems="center">
                                    <Box sx={{
                                        width: 48, height: 48, borderRadius: '12px',
                                        bgcolor: `${item.color}20`, color: item.color,
                                        display: 'flex', alignItems: 'center', justifyContent: 'center'
                                    }}>
                                        <EventIcon />
                                    </Box>
                                    <Box sx={{ flexGrow: 1 }}>
                                        <Typography fontWeight={700}>{item.subject}</Typography>
                                        <Typography variant="body2" color="text.secondary">{item.class}</Typography>
                                    </Box>
                                    <Typography variant="caption" fontWeight={600} sx={{
                                        bgcolor: '#f1f5f9', px: 1.5, py: 0.5, borderRadius: '8px', color: '#475569'
                                    }}>
                                        {item.time}
                                    </Typography>
                                </Stack>
                                {i !== 2 && <Divider sx={{ my: 2 }} />}
                            </Box>
                        ))}
                    </Paper>
                </Grid>

                {/* Quick Actions */}
                <Grid item xs={12} md={5}>
                    <Paper
                        elevation={0}
                        sx={{
                            p: { xs: 3, md: 4 },
                            borderRadius: '24px',
                            background: 'linear-gradient(180deg, #1e293b 0%, #0f172a 100%)',
                            color: '#fff',
                            height: '100%'
                        }}
                    >
                        <Typography fontWeight={800} sx={{ mb: 3 }}>
                            Quick Actions
                        </Typography>

                        {[
                            { label: 'Enter Class Marks', icon: <AddIcon />, action: () => navigate('/portal/staff/my-classes') },
                            { label: 'View Subject Teachers', icon: <SchoolIcon />, action: () => navigate('/portal/staff/academics') },
                            { label: 'View Announcements', icon: <CampaignIcon /> }
                        ].map((action, i) => (
                            <Button
                                key={i}
                                fullWidth
                                onClick={action.action}
                                startIcon={action.icon}
                                sx={{
                                    mb: 1.5,
                                    borderRadius: '14px',
                                    py: 1.6,
                                    justifyContent: 'flex-start',
                                    color: '#fff',
                                    background: 'rgba(255,255,255,0.1)',
                                    backdropFilter: 'blur(10px)',
                                    textTransform: 'none',
                                    fontSize: '0.95rem',
                                    fontWeight: 600,
                                    border: '1px solid rgba(255,255,255,0.1)',
                                    '&:hover': {
                                        background: 'rgba(255,255,255,0.18)',
                                        transform: 'translateX(4px)'
                                    },
                                    transition: 'all 0.2s'
                                }}
                            >
                                {action.label}
                            </Button>
                        ))}
                    </Paper>
                </Grid>
            </Grid>
        </Box>
    );
}

export default StaffDashboard;
