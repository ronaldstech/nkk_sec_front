import React, { useState, useEffect } from 'react';
import {
    Button,
    Dialog,
    Box,
    Typography,
    Table,
    TableHead,
    TableRow,
    TableCell,
    TableBody,
    TextField,
    Switch
} from '@mui/material';
import $ from 'jquery';
import Toast from '../../utils/toast';

function StaffHome() {
    const [sub, setSub] = useState([]);
    const [open, setOpen] = useState({
        upload: false
    });

    const getSubjects = () => {
        $.get("api/", { getSubjectsTeacher: "true" }, res => setSub(res))
    }

    const [info, setInfo] = useState({
        status: true
    });

    const getInfo = () => {
        $.get("api/", { getInfoUpload: true }, function (response) {
            let res = JSON.parse(response);
            if (res.status) {
                setInfo(res.data);
            } else {
                alert("error");
            }
        })
    }
    const [aca_data, setAcaData] = useState({});
    const [rows, setRows] = useState([]);

    const getYourStudents = (form, aca_id, name, term, subId) => {
        $.get("api/", {
            getYourStudents: true,
            form: form,
            academic_id: aca_id,
            subject_id: subId
        }, res => {
            setRows(res)
            setAcaData({ form: form, name: name, term: term, subject_id: subId, academic_id: aca_id })
            setOpen({ upload: true })
        })
    }

    const getYourStudentsMarks = (form, aca_id, name, term, subId) => {
        const params = new URLSearchParams({
            print_marks: true,
            form: form,
            academic_id: aca_id,
            subject_id: subId
        });

        const url = `api/index.php?${params.toString()}`;
        window.open(url, "_blank").focus();
    }

    const updateMark = (id, subject, form, academic_id, value) => {
        if (value == "" || value == null || value == undefined || value > 100 || value < 0) {
            return;
        } else {
            $.post("api/", {
                updateEndTerm: true,
                id: id,
                subject: subject,
                form: form,
                academic_id: academic_id,
                value: value
            }, function (response) {
                let res = JSON.parse(response);
                if (res.status) {
                    Toast(res.message);
                } else {
                    Toast(res.message);
                }
            })
        }
    }

    const updateAssessment = (id, subject, form, academic_id, value) => {
        if (value == "" || value == null || value == undefined || value > 100 || value < 0) {
            return;
        } else {
            $.post("api/", {
                updateAssessment: true,
                id: id,
                subject: subject,
                form: form,
                academic_id: academic_id,
                value: value
            }, function (response) {
                let res = JSON.parse(response);
                if (res.status) {
                    Toast(res.message);
                } else {
                    Toast(res.message);
                }
            })
        }
    }

    useEffect(() => {
        getSubjects();
        getInfo();
    }, []);

    return (
        <div>
            <h1>My Class Lists</h1>
            <div className="w3-padding">
                <Table>
                    <TableHead>
                        <TableRow>
                            <TableCell>#</TableCell>
                            <TableCell>Subject</TableCell>
                            <TableCell>Academic</TableCell>
                            <TableCell>Term</TableCell>
                            <TableCell>Form</TableCell>
                            <TableCell>Actions</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {sub.map((row, index) => (
                            <TableRow key={index}>
                                <TableCell>{index + 1}</TableCell>
                                <TableCell>{row.subject_data.name}</TableCell>
                                <TableCell>{row.academic_data.name}</TableCell>
                                <TableCell>{row.academic_data.term}</TableCell>
                                <TableCell>{row.form}</TableCell>
                                <TableCell>
                                    <Button variant="contained" size="small" sx={{ mr: 1 }} color="primary" onClick={() => getYourStudents(row.form, row.academic_id, row.academic_data.name, row.academic_data.term, row.subject_id)}>View List</Button>
                                    <Button variant="contained" size="small" sx={{ mr: 1 }} color="success" onClick={() => getYourStudentsMarks(row.form, row.academic_id, row.academic_data.name, row.academic_data.term, row.subject_id)}>Print List</Button>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </div>
            <Dialog fullScreen open={open.upload} onClose={() => setOpen({ ...open, upload: false })}>
                <div className="w3-padding w3-border-bottom">
                    <Typography variant="h6">
                        Upload Results for Form {aca_data.form} {aca_data.term} <br />
                        <small>{aca_data.name}</small>
                        <span className="w3-right w3-hover-text-red material-symbols-rounded" style={{ cursor: "pointer" }} onClick={() => setOpen({ ...open, upload: false })}>cancel</span>
                    </Typography>
                </div>
                {info.status == "active" ? (
                    <div className="w3-padding">
                        <Table>
                            <TableHead>
                                <TableRow>
                                    <TableCell>#</TableCell>
                                    <TableCell>Student Name</TableCell>
                                    <TableCell>Assessment (40%)</TableCell>
                                    <TableCell>End of Term (60%)</TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {rows.map((row, index) => (
                                    <TableRow key={index}>
                                        <TableCell>{index + 1}</TableCell>
                                        <TableCell>{row.student_data.names}</TableCell>
                                        <TableCell>
                                            <TextField size="small" type="number" defaultValue={row.assessment} onChange={e => updateAssessment(row.id, aca_data.subject_id, aca_data.form, aca_data.academic_id, e.target.value)} />
                                        </TableCell>
                                        <TableCell>
                                            <TextField size="small" type="number" defaultValue={row.end_term} onChange={e => updateMark(row.id, aca_data.subject_id, aca_data.form, aca_data.academic_id, e.target.value)} />
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </div>
                ) : (
                    <div className="w3-padding w3-center">
                        <Typography variant="h4" className="w3-text-red">Uploads are closed</Typography>
                    </div>
                )}
            </Dialog>
        </div>
    )
}

export default StaffHome;
