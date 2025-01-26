import { Container, Typography } from "@mui/material";
import React from "react";
import OrderDetails from "./OrderDetails";

const Confirmation = () => {
  return (
    <Container>
      <Typography variant="h5" gutterBottom>
        Thank you for your order.
      </Typography>
      <Typography variant="subtitle1">
        Your order number is #2001539. We have emailed your order confirmation,
        and will send you an update when your order has shipped.
      </Typography>
      <OrderDetails />
    </Container>
  );
};

export default Confirmation;
