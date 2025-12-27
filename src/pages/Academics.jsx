import React, { useState } from 'react';
import {
    Box,
    Tab,
    Tabs,
    Typography,
    Paper,
    Fade,
    useTheme,
    useMediaQuery,
    Container
} from '@mui/material';
import {
    AutoStories as SubjectsIcon, // More relevant icon
    AssignmentInd as TeacherIcon,
    EventAvailable as YearIcon
} from '@mui/icons-material';
import Subjects from './academics/Subjects';
import SubjectTeachers from './academics/SubjectTeachers';
import AcademicYears from './academics/AcademicYears';

function Academics() {
    const [tabIndex, setTabIndex] = useState(0);
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

    const handleChange = (event, newValue) => {
        setTabIndex(newValue);
    };

    return (
        <Fade in timeout={800}>
            <Box sx={{ p: { xs: 1, md: 2 }, minHeight: '100vh', bgcolor: '#f1f5f9' }}>
                <Container maxWidth="xl">
                    {/* Page Title Section */}
                    <Box sx={{ mb: 2 }}>
                        <Typography
                            variant="h5"
                            sx={{
                                fontWeight: 800,
                                color: '#1e293b',
                                letterSpacing: '-0.5px'
                            }}
                        >
                            Academics Management
                        </Typography>
                        <Typography variant="body2" sx={{ color: '#64748b' }}>
                            Configure curriculum, assign teachers, and manage sessions.
                        </Typography>
                    </Box>

                    <Paper
                        elevation={0}
                        sx={{
                            overflow: 'hidden',
                            borderRadius: '16px',
                            border: '1px solid rgba(226, 232, 240, 0.8)',
                            background: '#fff',
                            boxShadow: '0 4px 6px -1px rgba(0,0,0,0.05)'
                        }}
                    >
                        {/* Tab Navigation Wrapper */}
                        <Box sx={{
                            px: 2,
                            pt: 1,
                            bgcolor: '#fff',
                            borderBottom: '1px solid #f1f5f9'
                        }}>
                            <Tabs
                                value={tabIndex}
                                onChange={handleChange}
                                variant={isMobile ? "scrollable" : "standard"}
                                scrollButtons="auto"
                                sx={{
                                    minHeight: 48,
                                    '& .MuiTabs-flexContainer': {
                                        gap: 1
                                    },
                                    '& .MuiTab-root': {
                                        textTransform: 'none',
                                        fontWeight: 600,
                                        fontSize: '0.85rem',
                                        minHeight: 40,
                                        borderRadius: '8px',
                                        color: '#64748b',
                                        transition: 'all 0.2s ease',
                                        px: 2,
                                        mb: 1,
                                        '&:hover': {
                                            bgcolor: '#f8fafc',
                                            color: '#475569',
                                        },
                                        '&.Mui-selected': {
                                            color: '#6366f1',
                                            bgcolor: 'rgba(99, 102, 241, 0.08)',
                                        }
                                    },
                                    '& .MuiTabs-indicator': {
                                        display: 'none' // Hidden for a cleaner "pill" look
                                    }
                                }}
                            >
                                <Tab icon={<TeacherIcon fontSize="small" />} iconPosition="start" label="Subject Teachers" />
                                <Tab icon={<SubjectsIcon fontSize="small" />} iconPosition="start" label="Subjects" />
                                <Tab icon={<YearIcon fontSize="small" />} iconPosition="start" label="Academic Years" />
                            </Tabs>
                        </Box>

                        {/* Content Area with a different background to provide depth */}
                        <Box sx={{
                            p: { xs: 2, md: 3 },
                            bgcolor: '#fcfcfd',
                            minHeight: 400
                        }}>
                            <Paper
                                variant="outlined"
                                sx={{
                                    p: { xs: 2, md: 2 },
                                    borderRadius: '12px',
                                    border: '1px dashed #e2e8f0',
                                    bgcolor: 'transparent',
                                    minHeight: 300
                                }}
                            >
                                {/* Conditional Rendering with specialized Fade */}
                                <TabPanel value={tabIndex} index={0}>
                                    <SubjectTeachers />
                                </TabPanel>
                                <TabPanel value={tabIndex} index={1}>
                                    <Subjects />
                                </TabPanel>
                                <TabPanel value={tabIndex} index={2}>
                                    <AcademicYears />
                                </TabPanel>
                            </Paper>
                        </Box>
                    </Paper>
                </Container>
            </Box>
        </Fade>
    );
}

/* Helper Component for cleaner transitions */
function TabPanel({ children, value, index }) {
    return (
        <div role="tabpanel" hidden={value !== index}>
            {value === index && (
                <Fade in={true} timeout={400}>
                    <Box>{children}</Box>
                </Fade>
            )}
        </div>
    );
}

export default Academics;