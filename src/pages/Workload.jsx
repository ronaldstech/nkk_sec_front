import React from 'react';
import { Box, Typography, Paper, Fade } from '@mui/material';
import SubjectTeachers from './academics/SubjectTeachers';

function Workload() {
    return (
        <Fade in timeout={800}>
            <Box sx={{
                p: { xs: 0, md: 1 },
                minHeight: '100vh',
                bgcolor: '#f8fafc'
            }}>
                {/* Page Title Section */}
                <Box sx={{ mb: { xs: 2, md: 3 }, px: { xs: 1, md: 0 }, pt: { xs: 1, md: 0 } }}>
                    <Typography
                        variant="h5"
                        sx={{
                            fontWeight: 900,
                            color: '#0f172a',
                            fontSize: { xs: '1.25rem', md: '1.75rem' }
                        }}
                    >
                        Teacher Workload
                    </Typography>
                    <Typography sx={{ color: '#64748b', fontSize: 13 }}>
                        Manage and view teacher subject allocations and workload distribution.
                    </Typography>
                </Box>

                <Paper
                    elevation={0}
                    sx={{
                        p: { xs: 1, md: 3 },
                        borderRadius: { xs: 0, md: 2 },
                        border: '1px solid #e2e8f0',
                        background: '#fff',
                        boxShadow: '0 4px 6px -1px rgba(0,0,0,0.05)'
                    }}
                >
                    <SubjectTeachers />
                </Paper>
            </Box>
        </Fade>
    );
}

export default Workload;
