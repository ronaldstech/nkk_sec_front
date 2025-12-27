import React, { useState } from 'react';
import { Button } from '@mui/material';
import { Home as HomeIcon, Bookmarks as BookmarksIcon, Cached as CachedIcon } from '@mui/icons-material';
import StaffHome from './StaffHome';
import StaffSubjects from './StaffSubjects';
import StaffAcademicYears from './StaffAcademicYears';

function StaffAcademics() {
    const [stage, setStage] = useState("Home");

    const menus = [
        {
            title: "Home",
            icon: <HomeIcon />
        },
        {
            title: "Subjects",
            icon: <BookmarksIcon />
        },
        {
            title: "Academic Years",
            icon: <CachedIcon />
        }
    ];

    return (
        <div>
            <div className="w3-padding w3-border-bottom">
                <h1>Academics</h1>
            </div>
            <div className="w3-padding">
                {menus.map((menu, index) => (
                    <Button key={index} variant="outlined" sx={{
                        "&:hover": { background: "#ff3385", color: "white" },
                        mr: 1,
                        color: stage == menu.title ? "white" : "",
                        borderRadius: "10px",
                        background: stage == menu.title ? "#660029" : ""
                    }} onClick={() => setStage(menu.title)} color="error">
                        {menu.icon} {menu.title}
                    </Button>
                ))}
            </div>
            <div className="w3-padding">
                {stage == "Home" && <StaffHome />}
                {stage == "Subjects" && <StaffSubjects />}
                {stage == "Academic Years" && <StaffAcademicYears />}
            </div>
        </div>
    );
}

export default StaffAcademics;
