import React, { useState, useEffect } from 'react';
import {
    Table,
    TableHead,
    TableRow,
    TableCell,
    TableBody
} from '@mui/material';
import $ from 'jquery';

function StaffSubjects() {
    const [rows, setRows] = useState([]);

    const getSubjects = () => {
        $.get("api/", { getSubjects: "true" }, res => setRows(res))
    }

    useEffect(getSubjects, []);
    return (
        <div>
            <h1 className="w3-border-bottom">Subjects</h1>
            <div className="">
                <Table>
                    <TableHead>
                        <TableRow>
                            <TableCell>#</TableCell>
                            <TableCell>Subject Name</TableCell>
                            <TableCell>Root</TableCell>
                            <TableCell>Status</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {rows.map((row, index) => (
                            <TableRow key={index}>
                                <TableCell>{index + 1}</TableCell>
                                <TableCell>{row.name}</TableCell>
                                <TableCell>{row.root}</TableCell>
                                <TableCell>{row.status}</TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </div>
        </div>
    );
}

export default StaffSubjects;
