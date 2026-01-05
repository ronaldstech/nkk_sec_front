import React, { useState } from 'react';
import { useAppContext } from '../../../context/AppContext';
import {
    Button,
    Dialog,
    Box,
    Typography,
    TextField,
    FormControl,
    InputLabel,
    Select,
    MenuItem,
    DialogTitle,
    IconButton,
    InputAdornment,
    DialogContent
} from '@mui/material';
import {
    Close as CloseIcon,
    Person as PersonIcon,
    School as SchoolIcon,
    Transgender as GenderIcon,
    Save as SaveIcon
} from '@mui/icons-material';

const StudentAddDialog = ({ open, onClose, onSave }) => {
    const { schoolType } = useAppContext();
    const [form, setForm] = useState("");
    const [gender, setGender] = useState("");

    const handleFormChange = (event) => {
        setForm(event.target.value);
    };

    const handleGenderChange = (event) => {
        setGender(event.target.value);
    };

    const handleSubmit = (e) => {
        // onSave expects the event to extract form data
        // We'll trust the parent uses FormData on the event target or similar
        onSave(e);
        setForm("");
        setGender("");
    };

    return (
        <Dialog
            open={open}
            onClose={onClose}
            maxWidth="xs"
            fullWidth
            PaperProps={{
                sx: {
                    borderRadius: '20px',
                    boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1)'
                }
            }}
        >
            {/* Header */}
            <DialogTitle sx={{
                m: 0,
                p: 3,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between'
            }}>
                <Typography variant="h6" sx={{ fontWeight: 700, color: '#1e293b' }}>
                    Add New Student
                </Typography>
                <IconButton onClick={onClose} sx={{ color: '#94a3b8' }}>
                    <CloseIcon />
                </IconButton>
            </DialogTitle>

            <form onSubmit={handleSubmit}>
                <DialogContent sx={{ p: 4, pt: 1 }}>
                    <Typography variant="body2" sx={{ color: '#64748b', mb: 3 }}>
                        Enter the new student's details below.
                    </Typography>

                    <TextField
                        label="First Name"
                        name="fname_add"
                        variant="outlined"
                        fullWidth
                        required
                        sx={{ mb: 3 }}
                        InputProps={{
                            startAdornment: <InputAdornment position="start"><PersonIcon fontSize="small" sx={{ color: '#94a3b8' }} /></InputAdornment>
                        }}
                    />
                    <TextField
                        label="Middle Name"
                        name="mname_add"
                        variant="outlined"
                        fullWidth
                        sx={{ mb: 3 }}
                        InputProps={{
                            startAdornment: <InputAdornment position="start"><PersonIcon fontSize="small" sx={{ color: '#94a3b8' }} /></InputAdornment>
                        }}
                    />
                    <TextField
                        label="Last Name"
                        name="lname_add"
                        variant="outlined"
                        fullWidth
                        required
                        sx={{ mb: 3 }}
                        InputProps={{
                            startAdornment: <InputAdornment position="start"><PersonIcon fontSize="small" sx={{ color: '#94a3b8' }} /></InputAdornment>
                        }}
                    />
                    <TextField
                        label="School Type"
                        name="school"
                        value={schoolType.toUpperCase()}
                        variant="outlined"
                        fullWidth
                        disabled
                        sx={{ mb: 3 }}
                        InputProps={{
                            startAdornment: <InputAdornment position="start"><SchoolIcon fontSize="small" sx={{ color: '#94a3b8' }} /></InputAdornment>
                        }}
                    />
                    {/* Keep hidden actual value for form submission if needed, though disabled fields might not submit in some cases */}
                    <input type="hidden" name="school" value={schoolType} />

                    <FormControl fullWidth sx={{ mb: 3 }}>
                        <InputLabel id="form">Form</InputLabel>
                        <Select
                            labelId="form_add"
                            name="form_add"
                            value={form}
                            label="Form"
                            onChange={handleFormChange}
                            required
                            startAdornment={<InputAdornment position="start" sx={{ ml: -0.5, mr: 1 }}><SchoolIcon fontSize="small" sx={{ color: '#94a3b8' }} /></InputAdornment>}
                        >
                            <MenuItem value={1}>Form 1</MenuItem>
                            <MenuItem value={2}>Form 2</MenuItem>
                            <MenuItem value={3}>Form 3</MenuItem>
                            <MenuItem value={4}>Form 4</MenuItem>
                        </Select>
                    </FormControl>

                    <FormControl fullWidth sx={{ mb: 3 }}>
                        <InputLabel id="gender">Gender</InputLabel>
                        <Select
                            labelId="gender_add"
                            name="gender_add"
                            value={gender}
                            label="Gender"
                            onChange={handleGenderChange}
                            required
                            startAdornment={<InputAdornment position="start" sx={{ ml: -0.5, mr: 1 }}><GenderIcon fontSize="small" sx={{ color: '#94a3b8' }} /></InputAdornment>}
                        >
                            <MenuItem value="male">Male</MenuItem>
                            <MenuItem value="female">Female</MenuItem>
                            <MenuItem value="other">Other</MenuItem>
                        </Select>
                    </FormControl>

                    <Box sx={{
                        display: 'flex',
                        gap: 2,
                        mt: 2
                    }}>
                        <Button
                            onClick={onClose}
                            fullWidth
                            sx={{ color: '#64748b', bgcolor: '#f1f5f9', '&:hover': { bgcolor: '#e2e8f0' }, textTransform: 'none', borderRadius: 3, py: 1.5 }}
                        >
                            Cancel
                        </Button>
                        <Button
                            type="submit"
                            variant="contained"
                            fullWidth
                            startIcon={<SaveIcon />}
                            sx={{
                                background: 'linear-gradient(135deg, #6366f1 0%, #4f46e5 100%)',
                                boxShadow: '0 4px 12px rgba(79, 70, 229, 0.3)',
                                textTransform: 'none',
                                borderRadius: 3,
                                py: 1.5
                            }}
                        >
                            Save
                        </Button>
                    </Box>
                </DialogContent>
            </form>
        </Dialog>
    );
};

export default StudentAddDialog;
