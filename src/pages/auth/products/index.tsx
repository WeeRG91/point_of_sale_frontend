import { Box } from "@mui/material";
import { observer } from "mobx-react-lite";
import React from "react";
import { Outlet } from "react-router-dom";

function Products() {
  return (
    <div>
      <h2>Products</h2>
      <Box sx={{ mt: 2 }}>
        <Outlet />
      </Box>
    </div>
  );
}

export default observer(Products);
