import { Typography } from "@mui/material";
import React from "react";
import Link from "@mui/material/Link";
import { APP_URLS, MESSAGES } from "constants/common";

const Copyright = () => {
  return (
    <Typography variant="body2" color="textSecondary" align="center">
      {"Copyright © "}
      <Link color="inherit" href={APP_URLS.ecommDashboard}>
        {MESSAGES.companyName}
      </Link>{" "}
      {new Date().getFullYear()}
      {"."}
    </Typography>
  );
};

export default Copyright;
