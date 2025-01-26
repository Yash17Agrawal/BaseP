import { Button, Container, Grid, TextField, Typography } from "@mui/material";
import { sendContactUsData } from "actions/ecommerceActions";
import { APP_URLS } from "constants/common";
import React, { useState } from "react";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router";

const ContactUs = () => {
  const [name, setName] = useState("");
  const [contact, setContact] = useState("");
  const [address, setAddress] = useState("");
  const [query, setQuery] = useState("");
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const submit = (event: any) => {
    event.preventDefault();
    dispatch(
      sendContactUsData({ name, contact, address, query }, () => {
        navigate(APP_URLS.ecommDashboard);
      })
    );
  };

  return (
    <Container style={{ padding: "3em" }}>
      <Typography variant="h4" style={{ marginBottom: "1em" }}>
        Contact Us
      </Typography>
      <form
        style={{ display: "flex", flexDirection: "column" }}
        onSubmit={submit}
      >
        <Grid container spacing={5}>
          <Grid item xs={12} sm={5}>
            <TextField
              required
              id="name"
              name="name"
              label="Name"
              fullWidth
              variant="outlined"
              value={name}
              autoComplete="fname"
              onChange={(event) => {
                setName(event.target.value);
              }}
            />
          </Grid>
          <Grid item xs={12} sm={5}>
            <TextField
              required
              id="contactNumber"
              name="contactNumber"
              label="Contact Number"
              fullWidth
              variant="outlined"
              type="number"
              value={contact}
              autoComplete="contactNumber number"
              onChange={(event) => {
                setContact(event.target.value);
              }}
            />
          </Grid>
          <Grid item xs={12} sm={5}>
            <TextField
              required
              id="address1"
              name="address1"
              label="Address line 1"
              variant="outlined"
              fullWidth
              value={address}
              autoComplete="billing address-line1"
              onChange={(event) => {
                setAddress(event.target.value);
              }}
            />
          </Grid>
          <Grid item xs={12} sm={12}>
            <TextField
              fullWidth
              id="standard-multiline-static"
              label="Query"
              multiline
              minRows={10}
              value={query}
              required
              variant="outlined"
              onChange={(event) => {
                setQuery(event.target.value);
              }}
            />
          </Grid>
          <Grid item xs={12} sm={12}>
            <Button type="submit" variant="contained" color="primary">
              Submit
            </Button>
          </Grid>
        </Grid>
      </form>
    </Container>
  );
};

export default ContactUs;
