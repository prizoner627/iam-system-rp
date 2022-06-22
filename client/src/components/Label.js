import React from "react";

import { Typography } from "@mui/material";

export default function Label({ text, marginBottom, required }) {
  return (
    <div>
      {required ? (
        <>
          <Typography variant="overline" display="block">
            <b
              style={{
                float: "left",
                marginBottom: marginBottom,
                color: "red",
              }}
            >
              *&nbsp;
            </b>
          </Typography>
          <Typography variant="overline" display="block">
            <b style={{ float: "left", marginBottom: marginBottom }}>{text}</b>
          </Typography>
        </>
      ) : (
        <Typography variant="overline" display="block">
          <b style={{ float: "left", marginBottom: marginBottom }}>{text}</b>
        </Typography>
      )}
    </div>
  );
}
