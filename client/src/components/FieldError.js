import React from "react";

import { Typography } from "@mui/material";

export default function FieldError({ text, marginTop }) {
  return (
    <div>
      <Typography
        variant="body2"
        display="block"
        style={{
          float: "left",
          marginTop: marginTop,
          color: "#FF0000",
          fontSize: "12px",
        }}
      >
        {text}
      </Typography>
    </div>
  );
}
