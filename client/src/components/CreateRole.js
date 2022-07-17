import * as React from "react";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";

import { Grid, TextField, Typography } from "@mui/material";
import FieldError from "./FieldError";
import Label from "./Label";

import axios from "axios";
import { useForm, ErrorMessage, Controller } from "react-hook-form";

export default function MaxWidthDialog() {
  const [open, setOpen] = React.useState(false);

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
    // setLoading(true);

    try {
      let postData = {
        name: data.name,
        label: data.name,
        value: data.name,
        description: data.description,
      };

      const data1 = await axios.post(
        `http://164.92.213.2:5001/create-role`,
        postData
      );

      window.location.reload();
    } catch (err) {
      console.log(err);
      // setLoading(false);
    }
  };

  return (
    <React.Fragment>
      <Button variant="outlined" onClick={handleClickOpen}>
        Create Role
      </Button>
      <Dialog fullWidth={true} maxWidth="sm" open={open} onClose={handleClose}>
        <DialogTitle>Create Role</DialogTitle>
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
                  <Label text="Role Name" marginBottom="0px" />
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
                    placeholder=""
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
                  <Label text="Description" marginBottom="0px" />
                </Grid>

                <Grid
                  item
                  md={12}
                  xs={12}
                  sm={12}
                  style={{ marginBottom: "16px" }}
                >
                  <TextField
                    id="description"
                    name="description"
                    placeholder=""
                    color="primary"
                    multiline
                    rows={4}
                    variant="outlined"
                    size="small"
                    InputLabelProps={{
                      shrink: true,
                    }}
                    InputProps={{
                      autoComplete: "false",
                    }}
                    fullWidth
                    {...register("description", {
                      required: "description is required",
                    })}
                    error={errors.description ? true : false}
                  />

                  <FieldError
                    text={
                      errors.description ? errors.description.message : null
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
