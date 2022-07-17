import {
  Button,
  Container,
  Divider,
  Grid,
  IconButton,
  Paper,
  TextField,
  Alert,
  Typography,
  Chip,
} from "@mui/material";
import Select from "react-select";

import React, { useState, useEffect } from "react";
import { v4 as uuidv4 } from "uuid";
import { useForm, ErrorMessage, Controller } from "react-hook-form";

import Dashboard from "../components/Dashboard";
import FieldError from "../components/FieldError";
import Label from "../components/Label";
import Spinner from "../components/Spinner";

import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";

import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import DeleteIcon from "@mui/icons-material/Delete";

import { makeStyles } from "@mui/styles";
import axios from "axios";
import { NavLink } from "react-router-dom";

// import { db, bucket } from "../util/config";

const useStyles = makeStyles((theme) => ({
  box: {
    backgroundColor: "white",
    borderRadius: "4px",
    padding: "24px",
    boxShadow: `0px 10px 38px rgba(221, 230, 237, 1)`,
  },
  boxContainer: {
    paddingTop: "10px",
    paddingLeft: "25px",
    paddingRight: "25px",
    paddingBottom: "10px",
  },
  textfield: {
    paddingLeft: "16px",
    paddingRight: "16px",
    paddingBottom: "8px",
    paddingTop: "8px",
  },
  formHeading: {
    paddingLeft: "16px",
    paddingRight: "16px",
    paddingBottom: "16px",
    paddingTop: "16px",
  },
  link: {
    display: "flex",
    color: "black",
    textDecoration: "none",
  },
  icon: {
    marginRight: 0.5,
    width: 20,
    height: 20,
  },
  spinner: {
    display: "flex",
    direction: "row",
    alignItems: "center",
    justifyContent: "center",
    height: "90vh",
  },
}));

const customStyles = {
  control: (base, state) => ({
    ...base,
    border: "1px solid red",
    // You can also use state.isFocused to conditionally style based on the focus state
  }),
};

export default function Users() {
  const classes = useStyles();

  const [admins, setAdmins] = useState([]);
  const [exams, setExams] = useState([]);
  const [loading, setLoading] = useState(true);

  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);

  useEffect(() => {
    getUsers();
  }, []);

  const verifiyAdmin = async (id) => {
    setLoading(true);

    try {
      let postData = {
        employeeId: id,
      };

      const data = await axios.post(
        `http://164.92.213.2:5001/verify-admin`,
        postData
      );

      window.location.reload();
    } catch (err) {
      console.log(err);
      setLoading(false);
    }
  };

  const onDelete = async (id) => {
    setLoading(true);

    try {
      let postData = {
        employeeId: id,
      };

      const data = await axios.post(
        "http://164.92.213.2:5001/delete-admin",
        postData,
        { credentials: true }
      );

      window.location.reload();
    } catch (err) {
      console.log(err);
      setLoading(false);
    }
  };

  const getUsers = async () => {
    setLoading(true);

    try {
      const data = await axios.get("http://164.92.213.2:5001/get-users", {
        withCredentials: true,
      });

      setAdmins(data?.data?.data);
      console.log(data.data.data);

      setLoading(false);
    } catch (err) {
      console.log(err);
      setAdmins([]);

      setLoading(false);
    }
  };

  return (
    <>
      {loading ? (
        <Grid container component="main" spacing={3}>
          <Grid className={classes.spinner} item md={12} sm={12} xs={12}>
            <Spinner type="propagate" size={15} />
          </Grid>
        </Grid>
      ) : (
        <>
          <Dashboard>
            <Container maxWidth="md">
              <Typography
                variant="h4"
                color="initial"
                align="center"
                style={{ marginBottom: "24px", marginTop: "24px" }}
              >
                <b>Manage Users</b>
              </Typography>
            </Container>

            <Container maxWidth="md">
              <Grid container direction="row">
                <Grid
                  container
                  item
                  lg={12}
                  md={12}
                  sm={12}
                  xs={12}
                  direction="row"
                  style={{ paddingTop: "48px" }}
                >
                  {error ? (
                    <Grid
                      item
                      md={12}
                      xs={12}
                      sm={12}
                      style={{ marginBottom: "24px" }}
                    >
                      <Alert severity="error">
                        <b>{error}</b>
                      </Alert>
                    </Grid>
                  ) : null}

                  {success ? (
                    <Grid
                      item
                      md={12}
                      xs={12}
                      sm={12}
                      style={{ marginBottom: "24px" }}
                    >
                      <Alert severity="success">
                        <b>{success}</b>
                      </Alert>
                    </Grid>
                  ) : null}

                  {admins.length > 0 ? (
                    <>
                      <Grid item md={12} xs={12} sm={12}>
                        <TableContainer
                          component={Paper}
                          style={{
                            boxShadow: `0px 10px 38px rgba(221, 230, 237, 1)`,
                          }}
                        >
                          <Table
                            className={classes.table}
                            aria-label="simple table"
                          >
                            <TableHead>
                              <TableRow>
                                <TableCell>
                                  <b>Username</b>
                                </TableCell>
                                <TableCell>
                                  <b>Email</b>
                                </TableCell>
                                <TableCell>
                                  <b>Created At</b>
                                </TableCell>

                                {/* <TableCell align="left">
                                  <b>Action</b>
                                </TableCell> */}
                              </TableRow>
                            </TableHead>
                            <TableBody>
                              {admins.map((admin) => (
                                <TableRow key={admin.employeeId}>
                                  <TableCell component="th" scope="row">
                                    {admin.fullname}
                                  </TableCell>

                                  <TableCell component="th" scope="row">
                                    {admin.email}
                                  </TableCell>

                                  <TableCell component="th" scope="row">
                                    {admin.createdAt}
                                  </TableCell>

                                  <TableCell align="left">
                                    {/* <NavLink
                                      to={`/view-logs/${admin.employeeId}`}
                                    >
                                      <Button
                                        variant="contained"
                                        color="primary"
                                        style={{ marginRight: "8px" }}
                                      >
                                        View Logs
                                      </Button>
                                    </NavLink> */}
                                    {/* 
                                    <Button
                                      onClick={() => onDelete(admin.employeeId)}
                                      variant="contained"
                                      color="error"
                                      startIcon={<DeleteIcon />}
                                    >
                                      Delete
                                    </Button> */}
                                  </TableCell>
                                </TableRow>
                              ))}
                            </TableBody>
                          </Table>
                        </TableContainer>
                      </Grid>

                      {/* <Grid
                          item
                          md={12}
                          xs={12}
                          sm={12}
                          style={{ marginTop: "24px" }}
                        >
                          <Button
                            variant="contained"
                            color="primary"
                            onClick={fetchMoreData}
                          >
                            <b>Fetch More</b>
                          </Button>
                        </Grid> */}
                    </>
                  ) : (
                    <Grid item md={12} xs={12} sm={12}>
                      <Typography variant="body1" color="initial">
                        No Admins Available
                      </Typography>
                    </Grid>
                  )}
                </Grid>
              </Grid>
            </Container>
          </Dashboard>
        </>
      )}
    </>
  );
}
