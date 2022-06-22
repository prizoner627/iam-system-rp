import React, { useState, useEffect, useContext, useRef } from "react";

import { makeStyles } from "@mui/styles";
import { useForm, ErrorMessage, Controller } from "react-hook-form";
import { NavLink } from "react-router-dom";
import Alert from "@mui/lab/Alert";
// import { Context } from "../util/Provider";
import axios from "axios";
import Select from "react-select";

// import logo from "../assets/images/logo.png";
import Button from "@mui/material/Button";
import Grid from "@mui/material/Grid";
import Container from "@mui/material/Container";
import TextField from "@mui/material/TextField";
import Typography from "@mui/material/Typography";

// import Appbar from "../components/Appbar";
import Label from "../components/Label";
import FieldError from "../components/FieldError";
import Spinner from "../components/Spinner";
import Title from "../components/Title";
// import Footer from "../components/Footer";

const useStyles = makeStyles((theme) => ({
  spinner: {
    display: "flex",
    direction: "row",
    alignItems: "center",
    justifyContent: "center",
    height: "90vh",
  },
}));

const employeeTypes = [
  { label: "Auth Admin", value: "authAdmin" },
  { label: "Blockchain Admin", value: "blockchainAdmin" },
];

const customStyles = {
  control: (base, state) => ({
    ...base,
    border: "1px solid red",
    // You can also use state.isFocused to conditionally style based on the focus state
  }),
};

export default function Register(props) {
  const classes = useStyles();
  // const { currentUser } = useContext(Context);

  const {
    watch,
    register,
    handleSubmit,
    setValue,
    control,
    reset,
    formState: { errors },
  } = useForm();

  const password = useRef({});
  password.current = watch("password", "");

  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const [loading, setLoading] = useState(false);

  // useEffect(() => {
  //   if (currentUser) {
  //     props.history.push("/");
  //   }

  //   setLoading(false);
  // }, []);

  const verify = async (d) => {
    try {
      setLoading(true);

      console.log(d);

      let data = {
        fullname: d.fullname,
        employeeId: d.employeeId,
        employeeType: d.employeeType.value,
        email: d.email,
        password: d.password,
        confirmPassword: d.confirmPassword,
      };

      const response = await axios.post(
        "http://localhost:5001/admin-register",
        data
      );

      setSuccess(response?.data?.message);
      setError(null);
      // reset();
      setLoading(false);
    } catch (err) {
      // reset();

      setError(err?.response?.data?.message);
      setSuccess(null);
      setLoading(false);
    }
  };

  return (
    <>
      {loading ? (
        <Grid container component="main" spacing={3}>
          <Grid
            style={{
              display: "flex",
              direction: "row",
              alignItems: "center",
              justifyContent: "center",
              height: "90vh",
            }}
            item
            md={12}
            sm={12}
            xs={12}
          >
            <Spinner type="pulse" />
          </Grid>
        </Grid>
      ) : (
        <>
          {/* <Appbar /> */}
          <Title name="Register" height="120px" />
          <Container
            maxWidth="sm"
            style={{
              marginBottom: "50px",
              padding: "24px",
            }}
          >
            <form onSubmit={handleSubmit(verify)}>
              <Grid
                container
                direction="row"
                alignItems="center"
                spacing={0}
                style={{ padding: "0px" }}
              >
                <Grid
                  item
                  md={12}
                  xs={12}
                  sm={12}
                  style={{ marginBottom: "32px" }}
                ></Grid>

                <Grid item md={12} xs={12} sm={12}>
                  <Label text="Name" marginBottom="0px" />
                </Grid>

                <Grid
                  item
                  md={12}
                  xs={12}
                  sm={12}
                  style={{ marginBottom: "16px" }}
                >
                  <TextField
                    id="fullname"
                    name="fullname"
                    placeholder="john doe"
                    color="primary"
                    variant="outlined"
                    size="small"
                    InputLabelProps={{
                      shrink: true,
                      className: classes.inputLabel,
                    }}
                    InputProps={{
                      className: classes.input,
                      autoComplete: "false",
                    }}
                    fullWidth
                    {...register("fullname", {
                      required: "Fullname is required",
                    })}
                    error={errors.fullname ? true : false}
                  />

                  <FieldError
                    text={errors.fullname ? errors.fullname.message : null}
                    marginTop="8px"
                  />
                </Grid>
                <Grid item md={12} xs={12} sm={12}>
                  <Label text="Employee ID" marginBottom="0px" />
                </Grid>

                <Grid
                  item
                  md={12}
                  xs={12}
                  sm={12}
                  style={{ marginBottom: "16px" }}
                >
                  <TextField
                    id="employeeId"
                    name="employeeId"
                    placeholder="emp123"
                    color="primary"
                    variant="outlined"
                    size="small"
                    InputLabelProps={{
                      shrink: true,
                      className: classes.inputLabel,
                    }}
                    InputProps={{
                      className: classes.input,
                      autoComplete: "false",
                    }}
                    fullWidth
                    {...register("employeeId", {
                      required: "Employee ID is required",
                    })}
                    error={errors.employeeId ? true : false}
                  />

                  <FieldError
                    text={errors.employeeId ? errors.employeeId.message : null}
                    marginTop="8px"
                  />
                </Grid>
                <Grid item md={12} xs={12} sm={12}>
                  <Label text="Employee Type" marginBottom="0px" />
                </Grid>

                <Grid
                  item
                  md={12}
                  xs={12}
                  sm={12}
                  style={{ marginBottom: "16px", textAlign: "left" }}
                >
                  <Controller
                    name="employeeType"
                    render={({ field }) => (
                      <Select
                        {...field}
                        options={employeeTypes}
                        styles={errors.employeeType ? customStyles : ""}
                      />
                    )}
                    control={control}
                    rules={{ required: "Employee Type is required" }}
                  />

                  <FieldError
                    text={
                      errors.employeeType ? errors.employeeType.message : null
                    }
                    marginTop="8px"
                  />
                </Grid>

                <Grid item md={12} xs={12} sm={12}>
                  <Label text="Email" marginBottom="0px" />
                </Grid>

                <Grid
                  item
                  md={12}
                  xs={12}
                  sm={12}
                  style={{ marginBottom: "16px" }}
                >
                  <TextField
                    id="email"
                    name="email"
                    placeholder="johndoe@gmail.com"
                    color="primary"
                    variant="outlined"
                    size="small"
                    InputLabelProps={{
                      shrink: true,
                      className: classes.inputLabel,
                    }}
                    InputProps={{
                      className: classes.input,
                      autoComplete: "false",
                    }}
                    fullWidth
                    {...register("email", {
                      required: "Email is required",
                    })}
                    error={errors.email ? true : false}
                  />

                  <FieldError
                    text={errors.email ? errors.email.message : null}
                    marginTop="8px"
                  />
                </Grid>
                <Grid item md={12} xs={12} sm={12}>
                  <Label text="Password" marginBottom="0px" />
                </Grid>

                <Grid
                  item
                  md={12}
                  xs={12}
                  sm={12}
                  style={{ marginBottom: "16px" }}
                >
                  <TextField
                    id="password"
                    name="password"
                    type="password"
                    placeholder="XXXXXXXXXX"
                    color="primary"
                    variant="outlined"
                    size="small"
                    InputLabelProps={{
                      shrink: true,
                      className: classes.inputLabel,
                    }}
                    InputProps={{
                      className: classes.input,
                      autoComplete: "false",
                    }}
                    fullWidth
                    {...register("password", {
                      required: "Password is required",
                      minLength: { value: 6, message: "Password is too short" },
                    })}
                    error={errors.password ? true : false}
                  />

                  <FieldError
                    text={errors.password ? errors.password.message : null}
                    marginTop="8px"
                  />
                </Grid>
                <Grid item md={12} xs={12} sm={12}>
                  <Label text="Confirm Password" marginBottom="0px" />
                </Grid>

                <Grid
                  item
                  md={12}
                  xs={12}
                  sm={12}
                  style={{ marginBottom: "16px" }}
                >
                  <TextField
                    id="confirmPassword"
                    name="confirmPassword"
                    placeholder="XXXXXXXXXX"
                    type="password"
                    color="primary"
                    variant="outlined"
                    size="small"
                    InputLabelProps={{
                      shrink: true,
                      className: classes.inputLabel,
                    }}
                    InputProps={{
                      className: classes.input,
                      autoComplete: "false",
                    }}
                    fullWidth
                    {...register("confirmPassword", {
                      required: "Confirm Password is required",
                      minLength: { value: 6, message: "Password is too short" },
                      validate: (value) =>
                        value === password.current ||
                        "The passwords do not match",
                    })}
                    error={errors.confirmPassword ? true : false}
                  />

                  <FieldError
                    text={
                      errors.confirmPassword
                        ? errors.confirmPassword.message
                        : null
                    }
                    marginTop="8px"
                  />
                </Grid>

                <Grid
                  item
                  md={12}
                  xs={12}
                  sm={12}
                  style={{ marginBottom: "24px" }}
                >
                  <Button
                    type="submit"
                    fullWidth
                    size="large"
                    variant="contained"
                    color="primary"
                  >
                    <b>Register</b>
                  </Button>
                </Grid>

                {/* <pre>{JSON.stringify(watch(), null, 2)}</pre> */}

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

                <Grid item md={12} xs={12} sm={12}>
                  <Typography variant="body1" color="initial">
                    Already have an account? Login
                    <NavLink to="/login" style={{ color: "#000080" }}>
                      {" "}
                      <b>Here</b>
                    </NavLink>
                  </Typography>
                </Grid>
              </Grid>
            </form>
          </Container>
        </>
      )}
      <Title name="" height="30px" />
      {/* <Footer /> */}
    </>
  );
}
