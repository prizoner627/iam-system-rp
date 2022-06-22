import React, { useState, useEffect } from "react";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";
import FormControl from "@mui/material/FormControl";
import FormControlLabel from "@mui/material/FormControlLabel";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import Select from "react-select";
import Switch from "@mui/material/Switch";
import { Grid, TextField, Typography } from "@mui/material";
import FieldError from "./FieldError";
import Label from "./Label";

import axios from "axios";

import { useForm, ErrorMessage, Controller } from "react-hook-form";

const customStyles = {
  control: (base, state) => ({
    ...base,
    border: "1px solid red",
    // You can also use state.isFocused to conditionally style based on the focus state
  }),
};

export default function MaxWidthDialog() {
  const [open, setOpen] = React.useState(false);
  const [roles, setRoles] = useState([]);
  const [exams, setExams] = useState([]);
  const [loading, setLoading] = useState(true);

  const {
    register,
    handleSubmit,
    control,
    formState: { errors, isValid },
    watch,
  } = useForm();

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const create = async (data) => {
    setLoading(true);

    try {
      console.log(data);

      let postData = {
        name: data.name,
        url: data.url,
        roles: data.role,
      };

      const data1 = await axios.post(
        "http://localhost:5001/create-application",
        postData
      );

      window.location.reload();
    } catch (err) {
      console.log(err);
      setRoles([]);

      setLoading(false);
    }
  };

  let options = [{ label: "data.label", value: "data.value" }];

  const getRoles = async () => {
    setLoading(true);

    try {
      const data = await axios.get("http://localhost:5001/get-roles", {
        withCredentials: true,
      });

      let options = [];

      data?.data?.data.map((data) => {
        return options.push({
          label: data.label,
          value: data.value,
        });
      });

      setRoles(options);
      console.log(options);

      setLoading(false);
    } catch (err) {
      console.log(err);
      setRoles([]);

      setLoading(false);
    }
  };

  useEffect(() => {
    getRoles();
  }, []);

  console.log(roles, "roles");

  return (
    <React.Fragment>
      <Button variant="outlined" onClick={handleClickOpen}>
        Create Application
      </Button>
      <Dialog fullWidth={true} maxWidth="sm" open={open} onClose={handleClose}>
        <DialogTitle>Create Application</DialogTitle>
        <DialogContent>
          <Box
            noValidate
            component="form"
            sx={{
              display: "flex",
              flexDirection: "column",
              m: "auto",
              width: "fit-content",
            }}
          >
            <form>
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
                  <Label text="Application Name" marginBottom="0px" />
                </Grid>

                <Grid
                  item
                  md={12}
                  xs={12}
                  sm={12}
                  style={{ marginBottom: "16px" }}
                >
                  <TextField
                    id="name"
                    name="name"
                    placeholder="blockchain"
                    color="primary"
                    variant="outlined"
                    size="small"
                    InputLabelProps={{
                      shrink: true,
                    }}
                    InputProps={{
                      autoComplete: "false",
                    }}
                    fullWidth
                    {...register("name", {
                      required: "name is required",
                    })}
                    error={errors.name ? true : false}
                  />

                  <FieldError
                    text={errors.name ? errors.name.message : null}
                    marginTop="8px"
                  />
                </Grid>

                <Grid item md={12} xs={12} sm={12}>
                  <Label text="Application URL" marginBottom="0px" />
                </Grid>

                <Grid
                  item
                  md={12}
                  xs={12}
                  sm={12}
                  style={{ marginBottom: "16px" }}
                >
                  <TextField
                    id="url"
                    name="url"
                    type="text"
                    placeholder="http://localhost:3000"
                    color="primary"
                    variant="outlined"
                    size="small"
                    InputLabelProps={{
                      shrink: true,
                    }}
                    InputProps={{
                      autoComplete: "false",
                    }}
                    fullWidth
                    {...register("url", {
                      required: "url is required",
                    })}
                    error={errors.url ? true : false}
                  />

                  <FieldError
                    text={errors.url ? errors.url.message : null}
                    marginTop="8px"
                  />
                </Grid>

                <Grid item md={12} xs={12} sm={12}>
                  <Label text="Role" marginBottom="0px" />
                </Grid>

                <Grid item md={12} xs={12} sm={12}>
                  <Controller
                    name="role"
                    render={({ field }) => (
                      <Select
                        {...field}
                        options={roles}
                        isMulti={true}
                        styles={errors.classID ? customStyles : ""}
                      />
                    )}
                    control={control}
                    rules={{ required: "Role is required" }}
                  />

                  <FieldError
                    text={errors.role ? errors.role.message : null}
                    marginTop="8px"
                  />
                </Grid>

                <Grid
                  item
                  md={12}
                  xs={12}
                  sm={12}
                  style={{ marginBottom: "24px", marginTop: "24px" }}
                >
                  <Button
                    onClick={handleSubmit(create)}
                    fullWidth
                    size="large"
                    variant="contained"
                    color="primary"
                  >
                    <b>Create</b>
                  </Button>
                </Grid>
              </Grid>
            </form>
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Close</Button>
        </DialogActions>
      </Dialog>
    </React.Fragment>
  );
}
