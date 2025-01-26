import React from "react";
import Checkout from "components/Ecommerce/Checkout";
import { Container } from "@mui/material";
import "../App.scss";

export default function withCheckoutFlowSteppers(
  Component: React.ComponentType
) {
  class Wrapped extends React.Component<any> {
    render() {
      return (
        <Container className="full-height" component={"main"}>
          <Checkout />
          <Component {...this.props} />
        </Container>
      );
    }
  }
  return Wrapped;
}
