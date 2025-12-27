import React, { useState, useEffect } from 'react';
import {
    Button,
    Input,
    Table,
    TableHead,
    TableRow,
    TableCell,
    TableBody,
    TablePagination
} from '@mui/material';
import $ from 'jquery';

function StaffStaff() {
    const [search, setSearch] = useState("");
    const [rows, setRows] = useState([]);
    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(8);

    const getStaff = () => {
        $.get("api/", { getStaff: "true" }, res => setRows(res))
    };

    const handleChangePage = (event, newPage) => {
        setPage(newPage);
    };

    const handleChangeRowsPerPage = (event) => {
        setRowsPerPage(parseInt(event.target.value, 10));
        setPage(0);
    };

    const print = () => {
        window.open("api/index.php?print_staff", "_blank").focus();
    }

    useEffect(() => {
        getStaff();
    }, [])

    return (
        <div>
            <div className="w3-padding w3-border-bottom">
                <h1>Staff</h1>
            </div>
            <div className="w3-padding">
                <Button onClick={print} variant="contained" color="secondary">Download PDF</Button><br />
                <Input type="text" value={search} onChange={e => setSearch(e.target.value)} variant="filled" className="float-right" placeholder="Search table" sx={{ width: 300, m: 1 }} />
                <div className="w3-padding">
                    <Table>
                        <TableHead>
                            <TableRow>
                                <TableCell>#</TableCell>
                                <TableCell>Username</TableCell>
                                <TableCell>Phone</TableCell>
                                <TableCell>Profile</TableCell>
                                <TableCell>Account Type</TableCell>
                                <TableCell>Status</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {rows
                                .filter(row => row.username.toLowerCase().includes(search.toLowerCase()))
                                .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                                .map((row, index) => (
                                    <TableRow key={index} sx={{ background: index % 2 == 0 ? "#f0f0f0" : "" }}>
                                        <TableCell>{index + 1}</TableCell>
                                        <TableCell>{row.username}</TableCell>
                                        <TableCell>{row.phone}</TableCell>
                                        <TableCell><img src={"images/pro_file.jpg"} style={{ width: 40 }} alt="Profile" /></TableCell>
                                        <TableCell>{row.acc_type}</TableCell>
                                        <TableCell>{row.status}</TableCell>
                                    </TableRow>
                                ))}
                        </TableBody>

                    </Table>
                    <TablePagination
                        rowsPerPageOptions={[5, 10, 25, 50, 100, 200, 500]}
                        component="div"
                        count={rows.length}
                        rowsPerPage={rowsPerPage}
                        page={page}
                        onPageChange={handleChangePage}
                        onRowsPerPageChange={handleChangeRowsPerPage} />
                </div>
            </div>
        </div>

    );
}

export default StaffStaff;
