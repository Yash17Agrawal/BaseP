import React from "react";
import { Typography, Link } from "@mui/material";
import { MESSAGES } from "constants/common";
import Copyright from "./Copyright";

// const useStyles = makeStyles((theme) => ({
//   footer: {
//     backgroundColor: theme.palette.background.paper,
//     padding: theme.spacing(2),
//     bottom: 0,
//     height: "8em",
//     width: "100%",
//     // position: "fixed"
//   },
// }));

const Footer = () => {
  return (
    <footer className={"footer"}>
      <Typography variant="h6" align="center" gutterBottom>
        We Would Love to hear from you
      </Typography>
      <Typography
        variant="subtitle1"
        align="center"
        color="textSecondary"
        component="p"
      >
        Something here to give the footer a purpose!
      </Typography>
      <Copyright />
    </footer>
  );
};

export default Footer;
