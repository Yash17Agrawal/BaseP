import {
  CssBaseline,
  Avatar,
  Typography,
  TextField,
  FormControlLabel,
  Checkbox,
  Grid,
  Box,
  Container,
  Button,
  Link,
  Card,
  CardActionArea,
  CardContent,
  CardMedia,
} from "@mui/material";
import { APP_URLS, MESSAGES } from "constants/common";
import React, { useState } from "react";
import { useNavigate } from "react-router";
import LocalShippingIcon from "@mui/icons-material/LocalShipping";
import LockIcon from "@mui/icons-material/Lock";

const UserAccount = () => {
  const navigate = useNavigate();

  const cards = [
    {
      title: "Your Orders",
      description: "View history",
      redirectTo: APP_URLS.ecommOrders,
      icon: <LocalShippingIcon />,
    },
    {
      title: "Login & Security",
      description: "Edit login, name & mobile number",
      redirectTo: APP_URLS.loginSecurity,
      icon: <LockIcon />,
    },
  ];

  return (
    <Container component="main">
      <Typography sx={{ margin: "1em 0" }} component="h1" variant="h4">
        Your Account
      </Typography>
      <Grid container spacing="2em">
        {cards.map((card) => {
          return (
            <Grid item md={4} lg={4} sm={12} xs={12}>
              <Card sx={{ height: "100%" }}>
                <CardActionArea
                  sx={{ height: "100%" }}
                  onClick={() => {
                    navigate(card.redirectTo);
                  }}
                >
                  <CardContent>
                    {card.icon}
                    <Typography gutterBottom variant="h6" component="div">
                      {card.title}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      {card.description}
                    </Typography>
                  </CardContent>
                </CardActionArea>
              </Card>
            </Grid>
          );
        })}
      </Grid>
    </Container>
  );
};

export default UserAccount;
