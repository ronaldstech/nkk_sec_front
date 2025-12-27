import React, { useState } from 'react';
import {
    Button,
    FormControl,
    InputLabel,
    Select,
    MenuItem,
    Typography,
    Box,
    Paper,
    Stack,
    Divider
} from '@mui/material';
import { Download as DownloadIcon, Description as DescriptionIcon } from '@mui/icons-material';

function Results() {
    const [root, setRoot] = useState("");

    // Kept for Select state management if needed, though form native submission uses name attributes
    const handleChange = (event) => {
        setRoot(event.target.value);
    };

    const downloadResults = (event) => {
        event.preventDefault();

        const formData = new FormData(event.target);
        const params = new URLSearchParams();

        for (let [key, value] of formData.entries()) {
            params.append(key, value);
        }

        const url = `api/?${params.toString()}`;
        window.open(url, '_blank'); // Open in new tab
    };

    return (
        <Box>
            <Box sx={{ mb: 3 }}>
                <Typography variant="h6" sx={{ fontWeight: 700, color: '#1e293b' }}>
                    Results Management
                </Typography>
                <Typography variant="body2" color="textSecondary">
                    Generate and download student reports and result sheets.
                </Typography>
            </Box>

            <Paper
                elevation={0}
                sx={{
                    p: 4,
                    borderRadius: 3,
                    border: '1px solid #e2e8f0',
                    maxWidth: 500,
                    background: 'rgba(255, 255, 255, 0.8)',
                    backdropFilter: 'blur(20px)'
                }}
            >
                <form onSubmit={downloadResults}>
                    <Stack spacing={3}>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                            <Box
                                sx={{
                                    width: 40, height: 40, borderRadius: 2,
                                    background: 'linear-gradient(135deg, #e0f2fe 0%, #bae6fd 100%)',
                                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                                    color: '#0284c7'
                                }}
                            >
                                <DescriptionIcon />
                            </Box>
                            <Typography variant="subtitle1" fontWeight={600}>
                                Download Options
                            </Typography>
                        </Box>

                        <Divider />

                        <FormControl size="small" fullWidth>
                            <InputLabel id="form_select">Select Form</InputLabel>
                            <Select
                                labelId="form_select"
                                name="form_select"
                                id="form_select"
                                label="Select Form"
                                defaultValue=""
                                onChange={handleChange}
                            >
                                <MenuItem value={1}>Form 1</MenuItem>
                                <MenuItem value={2}>Form 2</MenuItem>
                                <MenuItem value={3}>Form 3</MenuItem>
                                <MenuItem value={4}>Form 4</MenuItem>
                            </Select>
                        </FormControl>

                        <FormControl size="small" fullWidth>
                            <InputLabel id="type_select">Document Type</InputLabel>
                            <Select
                                labelId="type_select"
                                name="type_select"
                                id="type_select"
                                label="Document Type"
                                defaultValue=""
                                onChange={handleChange}
                            >
                                <MenuItem value="reports">School Reports (PDF)</MenuItem>
                                <MenuItem value="grades">Grade Sheet</MenuItem>
                                <MenuItem value="marks">Mark Sheet</MenuItem>
                                <MenuItem value="number_of_grades">Grade Statistics</MenuItem>
                            </Select>
                        </FormControl>

                        <Button
                            variant="contained"
                            type="submit"
                            size="large"
                            startIcon={<DownloadIcon />}
                            sx={{
                                borderRadius: 2,
                                textTransform: 'none',
                                fontWeight: 600,
                                py: 1.5,
                                background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
                                boxShadow: '0 4px 12px rgba(16, 185, 129, 0.3)'
                            }}
                        >
                            Download Document
                        </Button>
                    </Stack>
                </form>
            </Paper>
        </Box>
    )
}

export default Results;
