import { Grid } from "@mui/material";

import React from "react";
import { makeStyles } from "@mui/styles";
// import { css } from "@emotion/core";
import PropagateLoader from "react-spinners/PropagateLoader";
import PulseLoader from "react-spinners/PulseLoader";

const useStyles = makeStyles((theme) => ({
  spinner: {
    display: "flex",
    direction: "row",
    alignItems: "center",
    justifyContent: "center",
    textAlign: "center",
  },
}));

export default function Spinner({ type, size }) {
  const classes = useStyles();

  if (type === "propagate") {
    return (
      <Grid container component="main" spacing={3}>
        <Grid className={classes.spinner} item md={12} sm={12} xs={12}>
          <PropagateLoader
            // css={override}
            size={15}
            color={"#000080"}
            loading={true}
          />
        </Grid>
      </Grid>
    );
  }

  if (type === "pulse") {
    return (
      <Grid container component="main" spacing={3}>
        <Grid className={classes.spinner} item md={12} sm={12} xs={12}>
          <PulseLoader
            // css={override}
            size={size}
            color={"#000080"}
            loading={true}
          />
        </Grid>
      </Grid>
    );
  }
}
