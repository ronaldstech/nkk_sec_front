import React from 'react';
import { Typography, Button } from '@mui/material';

function StaffDashboard() {
    const change = () => {
        window.open("../kkss_open/staff.php");
    }
    return (
        <div className="w3-padding">
            <h3>Dashboard</h3>
            <hr />
            <Typography variant="body1">Day School</Typography>
            <Button variant="contained" sx={{ ml: 1 }} onClick={change} color="error">Change</Button>
        </div>
    )
}

export default StaffDashboard;
