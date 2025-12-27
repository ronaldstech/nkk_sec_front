import React, { useState, useEffect } from 'react';
import {
    Table,
    TableHead,
    TableRow,
    TableCell,
    TableBody
} from '@mui/material';
import $ from 'jquery';

function StaffAcademicYears() {
    const [rows, setRows] = useState([]);

    const fetchAcademicYears = () => {
        $.get("api/", { getAcademicYears: 1 }, function (res) {
            setRows(res);
        });
    };

    useEffect(() => {
        fetchAcademicYears();
    }, []);
    return (
        <div>
            <h1 className="w3-border-bottom">Academic Years</h1>
            <div className="">
                <Table>
                    <TableHead>
                        <TableRow>
                            <TableCell>#</TableCell>
                            <TableCell>Academic Year</TableCell>
                            <TableCell>Term</TableCell>
                            <TableCell>Opening Term</TableCell>
                            <TableCell>Closing Term</TableCell>
                            <TableCell>Next Term Begins On</TableCell>
                            <TableCell>Fees</TableCell>
                            <TableCell>School Requirements</TableCell>
                            <TableCell>Status</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {rows.map((row, index) => (
                            <TableRow key={index}>
                                <TableCell>{index + 1}</TableCell>
                                <TableCell>{row.name}</TableCell>
                                <TableCell>{row.term}</TableCell>
                                <TableCell>{row.opening_term}</TableCell>
                                <TableCell>{row.closing_term}</TableCell>
                                <TableCell>{row.next_term_begins}</TableCell>
                                <TableCell>{row.fees}</TableCell>
                                <TableCell>{row.requirements}</TableCell>
                                <TableCell>{row.status}</TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </div>
        </div>
    );
}

export default StaffAcademicYears;
