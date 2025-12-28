import React, { useContext } from 'react';
import { Box, Typography, Grid, Paper, Container, Avatar, Button, Stack } from '@mui/material';
import { AppContext } from '../../context/AppContext';
import {
    School as SchoolIcon,
    Class as ClassIcon,
    Assignment as AssignmentIcon,
    ArrowForward
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';

function StaffDashboard() {
    const { user } = useContext(AppContext);
    const navigate = useNavigate();

    const stats = [
        { title: "My Subjects", value: "0", icon: <SchoolIcon />, color: "#6366f1", bg: "#e0e7ff", link: "/portal/staff/academics" },
        { title: "My Classes", value: "0", icon: <ClassIcon />, color: "#10b981", bg: "#dcfce7", link: "/portal/staff/my-classes" }
    ];

    return (
        <Box sx={{ pb: 10 }}>
            {/* Banner */}
            <Box sx={{
                height: 280,
                background: 'linear-gradient(135deg, #1e293b 0%, #334155 100%)',
                position: 'relative',
                mb: 8,
                borderRadius: 4,
                overflow: 'hidden',
                boxShadow: '0 20px 25px -5px rgba(0,0,0,0.1)'
            }}>
                <Box sx={{
                    position: 'absolute',
                    top: 0, left: 0, right: 0, bottom: 0,
                    backgroundImage: 'radial-gradient(circle at 100% 100%, rgba(255,255,255,0.1) 0%, transparent 50%)'
                }} />

                <Container maxWidth="lg" sx={{ height: '100%', display: 'flex', alignItems: 'center' }}>
                    <Stack direction={{ xs: 'column', md: 'row' }} spacing={4} alignItems="center">
                        <Avatar
                            src="/images/profile.jpg"
                            sx={{
                                width: 100, height: 100,
                                border: '4px solid rgba(255,255,255,0.2)',
                                boxShadow: '0 10px 15px -3px rgba(0,0,0,0.2)'
                            }}
                        />
                        <Box sx={{ textAlign: { xs: 'center', md: 'left' }, color: '#fff' }}>
                            <Typography variant="h3" fontWeight={800} sx={{ mb: 1 }}>
                                Welcome back, {user.username || 'Staff'}!
                            </Typography>
                            <Typography variant="h6" sx={{ opacity: 0.8, fontWeight: 400 }}>
                                Staff Dashboard & Portal
                            </Typography>
                        </Box>
                    </Stack>
                </Container>
            </Box>

            <Container maxWidth="lg">
                <Grid container spacing={3}>
                    {stats.map((stat, index) => (
                        <Grid item xs={12} sm={6} md={4} key={index}>
                            <Paper
                                elevation={0}
                                sx={{
                                    p: 3,
                                    borderRadius: 4,
                                    border: '1px solid #e2e8f0',
                                    transition: 'all 0.2s',
                                    cursor: 'pointer',
                                    '&:hover': {
                                        transform: 'translateY(-4px)',
                                        boxShadow: '0 10px 15px -3px rgba(0,0,0,0.1)'
                                    }
                                }}
                                onClick={() => navigate(stat.link)}
                            >
                                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
                                    <Box sx={{ p: 1.5, borderRadius: 2, bgcolor: stat.bg, color: stat.color }}>
                                        {stat.icon}
                                    </Box>
                                    <ArrowForward sx={{ color: '#cbd5e1' }} />
                                </Box>
                                <Typography variant="h4" fontWeight={800} color="#1e293b" sx={{ mb: 0.5 }}>
                                    {stat.value}
                                </Typography>
                                <Typography variant="body2" color="#64748b" fontWeight={600}>
                                    {stat.title}
                                </Typography>
                            </Paper>
                        </Grid>
                    ))}
                </Grid>
            </Container>
        </Box>
    );
}

export default StaffDashboard;
