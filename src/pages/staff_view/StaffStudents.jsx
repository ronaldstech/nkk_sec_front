import React, { useState, useEffect } from 'react';
import {
    Button,
    Input,
    Table,
    TableHead,
    TableRow,
    TableCell,
    TableBody
} from '@mui/material';
import $ from 'jquery';

function StaffStudents() {
    const [search, setSearch] = useState("");
    const [rows, setRows] = useState([]);

    const getStudents = () => {
        $.get("api/", { getStudents: "true" }, res => setRows(res))
    };

    const print = () => {
        window.open("api/index.php?print_students", "_blank").focus();
    }

    useEffect(() => {
        getStudents();
    }, [])

    return (
        <div>
            <div className="w3-padding w3-border-bottom">
                <h1>Students</h1>
            </div>
            <div className="w3-padding">
                <Button onClick={print} variant="contained" color="secondary">Download PDF</Button><br />
                <Input type="text" value={search} onChange={e => setSearch(e.target.value)} variant="filled" className="float-right" placeholder="Search table" sx={{ width: 300, m: 1 }} />
                <div className="w3-padding">
                    <Table>
                        <TableHead>
                            <TableRow>
                                <TableCell>#</TableCell>
                                <TableCell>Last Name</TableCell>
                                <TableCell>First Name</TableCell>
                                <TableCell>Gender</TableCell>
                                <TableCell>Reg No</TableCell>
                                <TableCell>Email</TableCell>
                                <TableCell>Time Registered</TableCell>
                                <TableCell>Registered By</TableCell>
                                <TableCell>Profile</TableCell>
                                <TableCell>Form</TableCell>
                                <TableCell>Status</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {rows
                                .filter(row => {
                                    if (search == "") return row;
                                    return row.last.toLowerCase().includes(search.toLowerCase()) || row.first.toLowerCase().includes(search.toLowerCase())
                                })
                                .map((row, index) => (
                                    <TableRow key={index} sx={{ background: index % 2 == 0 ? "#f0f0f0" : "" }}>
                                        <TableCell>{index + 1}</TableCell>
                                        <TableCell>{row.last}</TableCell>
                                        <TableCell>{row.first}</TableCell>
                                        <TableCell>{row.gender}</TableCell>
                                        <TableCell>{row.student_reg}</TableCell>
                                        <TableCell>{row.email}</TableCell>
                                        <TableCell>{row.time_added}</TableCell>
                                        <TableCell>{row.admin_name}</TableCell>
                                        <TableCell><img src={"images/pro_file.jpg"} style={{ width: 40 }} alt="Student" /></TableCell>
                                        <TableCell>{row.form}</TableCell>
                                        <TableCell>{row.status}</TableCell>
                                    </TableRow>
                                ))}
                        </TableBody>

                    </Table>
                </div>
            </div>
        </div>

    );
}

export default StaffStudents;
