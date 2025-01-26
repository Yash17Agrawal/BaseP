import React, { useState } from "react";
import CssBaseline from "@mui/material/CssBaseline";
import Paper from "@mui/material/Paper";
import Stepper from "@mui/material/Stepper";
import Step from "@mui/material/Step";
import StepLabel from "@mui/material/StepLabel";
import { APP_URLS } from "constants/common";
import "./Checkout.scss";

const steps = ["Shipping address", "Review your order", "Confirmation"];

const Checkout = () => {
  const getActiveStep = () => {
    const location = window.location.href;
    if (location.includes(APP_URLS.ecommAddress)) return 0;
    if (location.includes(APP_URLS.ecommReview)) return 1;
    else return 2;
  };

  return (
    <Paper className={"layout paper"}>
      <Stepper activeStep={getActiveStep()} className={"stepper"}>
        {steps.map((label) => (
          <Step key={label}>
            <StepLabel>{label}</StepLabel>
          </Step>
        ))}
      </Stepper>
    </Paper>
  );
};

export default Checkout;
