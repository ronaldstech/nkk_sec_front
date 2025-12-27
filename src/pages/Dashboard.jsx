import React, { useState, useEffect } from 'react';
import {
    Button,
    Typography,
    Grid,
    Paper,
    Box,
    CircularProgress,
    Avatar,
    Divider,
    Stack
} from '@mui/material';
import {
    School as SchoolIcon,
    Person as PersonIcon,
    Class as ClassIcon,
    TrendingUp as TrendingUpIcon,
    Add as AddIcon,
    Campaign as CampaignIcon,
    Assessment as AssessmentIcon,
    ArrowForwardIos as ArrowIcon
} from '@mui/icons-material';

/* ---------------------- Stat Card ---------------------- */
const StatCard = ({ title, value, icon, color, loading, trend }) => (
    <Paper
        elevation={0}
        sx={{
            p: { xs: 2.5, md: 3 },
            height: '100%',
            borderRadius: '24px',
            background:
                'linear-gradient(180deg, rgba(255,255,255,0.88), rgba(255,255,255,0.7))',
            backdropFilter: 'blur(18px)',
            border: '1px solid rgba(0,0,0,0.05)',
            transition: 'all 0.3s ease',
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

/* ---------------------- Dashboard ---------------------- */
function Dashboard() {
    const [stats, setStats] = useState({
        students: '0',
        teachers: '0',
        classes: '0',
        performance: '0%'
    });
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const timer = setTimeout(() => {
            setStats({
                students: '1,240',
                teachers: '48',
                classes: '32',
                performance: '+12%'
            });
            setLoading(false);
        }, 1200);

        return () => clearTimeout(timer);
    }, []);

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
                        Dashboard
                    </Typography>
                    <Typography color="text.secondary">
                        Welcome back. Here is a quick overview.
                    </Typography>
                </Box>

                <Button
                    fullWidth={false}
                    sx={{
                        width: { xs: '100%', sm: 'auto' },
                        borderRadius: '14px',
                        px: 3,
                        py: 1.4,
                        bgcolor: '#111827',
                        fontWeight: 700,
                        color: '#fff',
                        '&:hover': { bgcolor: '#000' }
                    }}
                >
                    Change to Open
                </Button>
            </Stack>

            {/* Stats */}
            <Grid container spacing={2.5} sx={{ mb: 4 }}>
                <Grid item xs={12} sm={6} lg={3}>
                    <StatCard
                        title="Total Students"
                        value={stats.students}
                        icon={<PersonIcon />}
                        color="#6366f1, #a855f7"
                        loading={loading}
                        trend="+2.4% vs last month"
                    />
                </Grid>
                <Grid item xs={12} sm={6} lg={3}>
                    <StatCard
                        title="Faculty"
                        value={stats.teachers}
                        icon={<SchoolIcon />}
                        color="#ec4899, #f43f5e"
                        loading={loading}
                        trend="Full staffing"
                    />
                </Grid>
                <Grid item xs={12} sm={6} lg={3}>
                    <StatCard
                        title="Active Classes"
                        value={stats.classes}
                        icon={<ClassIcon />}
                        color="#f59e0b, #ef4444"
                        loading={loading}
                        trend="8 rooms in use"
                    />
                </Grid>
                <Grid item xs={12} sm={6} lg={3}>
                    <StatCard
                        title="Performance"
                        value={stats.performance}
                        icon={<TrendingUpIcon />}
                        color="#10b981, #3b82f6"
                        loading={loading}
                        trend="Strong growth"
                    />
                </Grid>
            </Grid>

            <Grid container spacing={3}>
                {/* Live Feed */}
                <Grid item xs={12} md={7}>
                    <Paper
                        elevation={0}
                        sx={{
                            p: { xs: 2.5, md: 4 },
                            borderRadius: '24px',
                            background: 'rgba(255,255,255,0.9)',
                            border: '1px solid rgba(0,0,0,0.05)'
                        }}
                    >
                        <Stack direction="row" justifyContent="space-between" mb={3}>
                            <Typography fontWeight={800}>Live Feed</Typography>
                            <Button size="small" endIcon={<ArrowIcon sx={{ fontSize: 12 }} />}>
                                View All
                            </Button>
                        </Stack>

                        {[
                            { user: 'System', action: 'Grading schema updated.', time: '2h ago', color: '#6366f1' },
                            { user: 'Admin', action: '5 students enrolled.', time: '5h ago', color: '#10b981' },
                            { user: 'Staff', action: 'Results published.', time: '1d ago', color: '#f59e0b' }
                        ].map((activity, i) => (
                            <Box key={i}>
                                <Stack direction="row" spacing={2} mb={2}>
                                    <Avatar sx={{ bgcolor: activity.color, fontWeight: 700 }}>
                                        {activity.user[0]}
                                    </Avatar>
                                    <Box>
                                        <Typography fontWeight={700}>{activity.user}</Typography>
                                        <Typography variant="body2">{activity.action}</Typography>
                                        <Typography variant="caption" color="text.disabled">
                                            {activity.time}
                                        </Typography>
                                    </Box>
                                </Stack>
                                {i !== 2 && <Divider />}
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
                            background: 'linear-gradient(180deg, #111827, #020617)',
                            color: '#fff'
                        }}
                    >
                        <Typography fontWeight={800} sx={{ mb: 3 }}>
                            Quick Commands
                        </Typography>

                        {[
                            { label: 'Add New Student', icon: <AddIcon /> },
                            { label: 'Post Announcement', icon: <CampaignIcon /> },
                            { label: 'Generate Reports', icon: <AssessmentIcon /> }
                        ].map((action, i) => (
                            <Button
                                key={i}
                                fullWidth
                                startIcon={action.icon}
                                sx={{
                                    mb: 1.5,
                                    borderRadius: '14px',
                                    py: 1.6,
                                    justifyContent: 'flex-start',
                                    color: '#fff',
                                    background: 'rgba(255,255,255,0.1)',
                                    '&:hover': {
                                        background: 'rgba(255,255,255,0.18)'
                                    }
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

export default Dashboard;
