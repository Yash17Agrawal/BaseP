import { Button, TextField } from "@mui/material";
// import { getEcommerceCouponItems } from "actions/ecommerceActions";
import React, { useState } from "react";
import { Modal, Container } from "react-bootstrap";
import { useDispatch } from "react-redux";

interface IProps {
  hideModal: (args: string | []) => void;
}

export const ApplyCouponModal: React.FC<IProps> = (props) => {
  const [data, setData] = useState("");
  const dispatch = useDispatch();
  const [warningText, setWarningText] = useState("");

  const submit = (event: any) => {
    event.preventDefault();
    if (data.length > 0) {
      // dispatch(
      //   getEcommerceCouponItems(data, () => {
      //       setWarningText("Invalid Coupon Code");
      //   })
      // );
    } else {
      setWarningText("Invalid Coupon Code");
    }
  };
  return (
    <Modal
      show={true}
      onHide={() => {
        props.hideModal([]);
      }}
      backdrop="static"
      centered
    >
      <form onSubmit={submit}>
        <Modal.Header closeButton>
          <Modal.Title>Coupon Name</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Container>
            <TextField
              value={data}
              fullWidth
              required
              onChange={(event) => {
                setData(event.target.value);
                setWarningText("");
              }}
            />
          </Container>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="contained" color="primary" type="submit">
            Submit
          </Button>
          {warningText.length > 0 ? (
            <TextField aria-readonly value={warningText} />
          ) : null}
        </Modal.Footer>
      </form>
    </Modal>
  );
};
