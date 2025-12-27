import React, { useState } from 'react';
import {
    Box,
    Tab,
    Tabs,
    Typography,
    Paper,
    Fade
} from '@mui/material';
import {
    Sort as SortIcon,
    Bookmarks as BookmarksIcon,
    Cached as CachedIcon
} from '@mui/icons-material';
import Subjects from './academics/Subjects';
import SubjectTeachers from './academics/SubjectTeachers';
import AcademicYears from './academics/AcademicYears';

function Academics() {
    const [tabIndex, setTabIndex] = useState(0);

    const handleChange = (event, newValue) => {
        setTabIndex(newValue);
    };

    return (
        <Fade in timeout={600}>
            <Box sx={{ p: { xs: 1, md: 3 } }}>
                <Paper
                    elevation={0}
                    sx={{
                        p: 0,
                        overflow: 'hidden',
                        borderRadius: 3,
                        border: '1px solid #e2e8f0',
                        background: 'linear-gradient(180deg, #ffffff 0%, #f8fafc 100%)',
                        boxShadow: '0 4px 20px rgba(0,0,0,0.05)'
                    }}
                >
                    {/* Header & Tabs */}
                    <Box sx={{
                        borderBottom: '1px solid #e2e8f0',
                        background: '#fff',
                        px: 3,
                        pt: 3
                    }}>
                        <Typography variant="h5" sx={{ fontWeight: 800, color: '#0f172a', mb: 2 }}>
                            Academics Management
                        </Typography>

                        <Tabs
                            value={tabIndex}
                            onChange={handleChange}
                            variant="scrollable"
                            scrollButtons="auto"
                            sx={{
                                '& .MuiTab-root': {
                                    textTransform: 'none',
                                    fontWeight: 600,
                                    fontSize: '0.95rem',
                                    minHeight: 48,
                                    color: '#64748b',
                                    '&.Mui-selected': {
                                        color: '#6366f1'
                                    }
                                },
                                '& .MuiTabs-indicator': {
                                    backgroundColor: '#6366f1',
                                    height: 3,
                                    borderRadius: '3px 3px 0 0'
                                }
                            }}
                        >
                            <Tab icon={<SortIcon fontSize="small" />} iconPosition="start" label="Subject Teachers" />
                            <Tab icon={<BookmarksIcon fontSize="small" />} iconPosition="start" label="Subjects" />
                            <Tab icon={<CachedIcon fontSize="small" />} iconPosition="start" label="Academic Years" />
                        </Tabs>
                    </Box>

                    {/* Content Area */}
                    <Box sx={{ p: 3, width: '100%', minHeight: 400, bgcolor: '#f8fafc' }}>
                        {tabIndex === 0 && (
                            <Fade in={tabIndex === 0}>
                                <Box><SubjectTeachers /></Box>
                            </Fade>
                        )}
                        {tabIndex === 1 && (
                            <Fade in={tabIndex === 1}>
                                <Box><Subjects /></Box>
                            </Fade>
                        )}
                        {tabIndex === 2 && (
                            <Fade in={tabIndex === 2}>
                                <Box><AcademicYears /></Box>
                            </Fade>
                        )}
                    </Box>
                </Paper>
            </Box>
        </Fade>
    );
}

export default Academics;
