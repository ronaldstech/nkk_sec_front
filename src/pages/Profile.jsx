import React, { useState, useEffect } from 'react';
import {
    Button,
    Dialog,
    Box,
    Typography,
    TextField,
    Paper,
    Avatar,
    Grid,
    IconButton,
    Stack,
    Divider
} from '@mui/material';
import {
    Edit as EditIcon,
    Close as CloseIcon,
    CameraAlt as CameraIcon,
    Person as PersonIcon,
    Phone as PhoneIcon,
    Email as EmailIcon,
    Lock as LockIcon,
    Badge as BadgeIcon,
    Logout as LogoutIcon
} from '@mui/icons-material';
import Toastify from 'toastify-js';
import "toastify-js/src/toastify.css";
import { useAppContext } from '../context/AppContext';

// Reusing the API URL convention if needed, though context handles some calls
const API_URL = "http://localhost/nkk_sec/api/index.php";

function Profile() {
    const { user, setUser, getUser } = useAppContext();

    const [open, setOpen] = useState({
        change: false, // password
        user: false, // username
        phone: false,
        email: false,
        image: false
    });

    const handleUpdate = async (event, field, endpoint = API_URL) => {
        event.preventDefault();
        const formData = new FormData(event.target);

        try {
            const response = await fetch(endpoint, {
                method: 'POST',
                body: new URLSearchParams(formData),
                headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
            });
            const text = await response.text();
            try {
                const res = JSON.parse(text);
                if (res.status) {
                    Toastify({
                        text: "Updated Successfully!",
                        backgroundColor: "linear-gradient(135deg, #10b981 0%, #059669 100%)"
                    }).showToast();

                    setOpen(prev => ({ ...prev, [field]: false }));
                    getUser(); // Refresh user data
                } else {
                    Toastify({ text: res.message || "Update Failed", backgroundColor: "#ef4444" }).showToast();
                }
            } catch (e) {
                console.error(text);
                Toastify({ text: "Server Error", backgroundColor: "#ef4444" }).showToast();
            }
        } catch (error) {
            Toastify({ text: "Connection Error", backgroundColor: "#ef4444" }).showToast();
        }
    }

    const changePassword = (e) => handleUpdate(e, 'change');
    const changeUsername = (e) => handleUpdate(e, 'user');
    const changeEmail = (e) => handleUpdate(e, 'email');
    const changePhone = (e) => handleUpdate(e, 'phone');

    useEffect(() => {
        getUser();
    }, []);

    // Reusable styles
    const cardStyle = {
        p: 3,
        borderRadius: 3,
        border: '1px solid #e2e8f0',
        background: '#fff',
        height: '100%'
    };

    const dialogPaperProps = { sx: { borderRadius: 3, width: 450 } };

    return (
        <Box>
            <Typography variant="h6" sx={{ fontWeight: 700, color: '#1e293b', mb: 3 }}>
                My Profile
            </Typography>

            <Grid container spacing={3}>
                {/* Profile Card */}
                <Grid item xs={12} md={4}>
                    <Paper elevation={0} sx={cardStyle}>
                        <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center' }}>
                            <Box sx={{ position: 'relative', mb: 2 }}>
                                <Avatar
                                    src="images/pro_file.jpg"
                                    sx={{ width: 120, height: 120, border: '4px solid #f8fafc' }}
                                />
                                <IconButton
                                    onClick={() => setOpen({ ...open, image: true })}
                                    sx={{
                                        position: 'absolute', bottom: 0, right: 0,
                                        bgcolor: '#6366f1', color: '#fff',
                                        '&:hover': { bgcolor: '#4f46e5' }
                                    }}
                                    size="small"
                                >
                                    <CameraIcon fontSize="small" />
                                </IconButton>
                            </Box>
                            <Typography variant="h6" fontWeight={700}>{user.username}</Typography>
                            <Typography variant="body2" color="textSecondary" sx={{ mb: 2 }}>{user.role}</Typography>

                            <Button
                                variant="outlined"
                                fullWidth
                                color="error"
                                startIcon={<LockIcon />}
                                onClick={() => setOpen({ ...open, change: true })}
                            >
                                Change Password
                            </Button>
                        </Box>
                    </Paper>
                </Grid>

                {/* Details Card */}
                <Grid item xs={12} md={8}>
                    <Paper elevation={0} sx={cardStyle}>
                        <Typography variant="subtitle1" fontWeight={700} sx={{ mb: 3 }}>Personal Information</Typography>

                        <Stack spacing={3}>
                            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                <Box sx={{ display: 'flex', gap: 2, alignItems: 'center' }}>
                                    <Avatar sx={{ bgcolor: '#eff6ff', color: '#3b82f6' }}><BadgeIcon /></Avatar>
                                    <Box>
                                        <Typography variant="caption" color="textSecondary">Username</Typography>
                                        <Typography variant="body1" fontWeight={500}>{user.username}</Typography>
                                    </Box>
                                </Box>
                                <Button size="small" startIcon={<EditIcon />} onClick={() => setOpen({ ...open, user: true })}>Edit</Button>
                            </Box>
                            <Divider />

                            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                <Box sx={{ display: 'flex', gap: 2, alignItems: 'center' }}>
                                    <Avatar sx={{ bgcolor: '#f0fdf4', color: '#22c55e' }}><PhoneIcon /></Avatar>
                                    <Box>
                                        <Typography variant="caption" color="textSecondary">Phone</Typography>
                                        <Typography variant="body1" fontWeight={500}>{user.phone}</Typography>
                                    </Box>
                                </Box>
                                <Button size="small" startIcon={<EditIcon />} onClick={() => setOpen({ ...open, phone: true })}>Edit</Button>
                            </Box>
                            <Divider />

                            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                <Box sx={{ display: 'flex', gap: 2, alignItems: 'center' }}>
                                    <Avatar sx={{ bgcolor: '#fff7ed', color: '#f97316' }}><EmailIcon /></Avatar>
                                    <Box>
                                        <Typography variant="caption" color="textSecondary">Email</Typography>
                                        <Typography variant="body1" fontWeight={500}>{user.email}</Typography>
                                    </Box>
                                </Box>
                                <Button size="small" startIcon={<EditIcon />} onClick={() => setOpen({ ...open, email: true })}>Edit</Button>
                            </Box>

                        </Stack>
                    </Paper>
                </Grid>
            </Grid>

            {/* --- DIALOGS --- */}

            {/* Generic Update Dialog Wrapper could be factored out, but keeping inline for simplicity with existing state */}
            {[
                { type: 'user', title: 'Change Username', field: 'username_edit', val: user.username, icon: <BadgeIcon />, handler: changeUsername },
                { type: 'phone', title: 'Change Phone', field: 'phone_edit', val: user.phone, icon: <PhoneIcon />, handler: changePhone },
                { type: 'email', title: 'Change Email', field: 'email_edit', val: user.email, icon: <EmailIcon />, handler: changeEmail }
            ].map((d) => (
                <Dialog key={d.type} open={open[d.type]} onClose={() => setOpen({ ...open, [d.type]: false })} PaperProps={dialogPaperProps}>
                    <Box sx={{ p: 2, display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid #f1f5f9' }}>
                        <Typography fontWeight={600}>{d.title}</Typography>
                        <IconButton size="small" onClick={() => setOpen({ ...open, [d.type]: false })}><CloseIcon /></IconButton>
                    </Box>
                    <form onSubmit={d.handler} style={{ padding: 20 }}>
                        <input type="hidden" name="user_id" value={user.id} />
                        <TextField
                            label={d.title.replace('Change ', '')}
                            name={d.field}
                            defaultValue={d.val}
                            fullWidth sx={{ mb: 3 }}
                        />
                        <Button type="submit" variant="contained" fullWidth sx={{ borderRadius: 2 }}>Save Changes</Button>
                    </form>
                </Dialog>
            ))}

            {/* Change Password Dialog */}
            <Dialog open={open.change} onClose={() => setOpen({ ...open, change: false })} PaperProps={dialogPaperProps}>
                <Box sx={{ p: 2, display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid #f1f5f9' }}>
                    <Typography fontWeight={600}>Change Password</Typography>
                    <IconButton size="small" onClick={() => setOpen({ ...open, change: false })}><CloseIcon /></IconButton>
                </Box>
                <form id="change_password" onSubmit={changePassword} style={{ padding: 20 }}>
                    <input type="hidden" name="user_id" value={user.id} />
                    <Stack spacing={2}>
                        <TextField label="Current Password" name="current_password" type="password" fullWidth required />
                        <TextField label="New Password" name="new_password" type="password" fullWidth required />
                        <TextField label="Confirm Password" name="confirm_password" type="password" fullWidth required />
                    </Stack>
                    <Button type="submit" variant="contained" color="error" fullWidth sx={{ mt: 3, borderRadius: 2 }}>Update Password</Button>
                </form>
            </Dialog>

        </Box>
    );
}

export default Profile;
