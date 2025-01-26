import {
  Grid,
  CardContent,
  Typography,
  CardActions,
  Button,
  CardActionArea,
  Paper,
  Container,
  Divider,
} from "@mui/material";
import { getAddresses, updateCartAddress } from "actions/ecommerceActions";
import Loader from "components/Loader/Loader";
import { APP_URLS } from "constants/common";
import { IAddressAPIResponse } from "interfaces/ecommerceInterfaces";
import React, { useEffect, useState } from "react";
import { Card } from "react-bootstrap";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router";
import CreateAddressForm from "./CreateAddress/CreateAddress";

export interface IProps {
  onSelect?: () => void;
}

const ChooseAddress = (props: IProps) => {
  const [addresses, setAddresses] = useState<IAddressAPIResponse[]>([]);
  const dispatch = useDispatch();
  useEffect(() => {
    dispatch(getAddresses(setAddresses));
  }, []);

  const navigate = useNavigate();
  const selectAddress = (deliveryAddress: number) => {
    dispatch(
      updateCartAddress(deliveryAddress, () => {
        navigate(APP_URLS.ecommReview);
      })
    );
  };
  return (
    <Container>
      <Loader />
      <Grid container spacing={4}>
        {addresses.map((item, index) => (
          <Grid item key={index} xs={12} sm={6} md={4}>
            <Card>
              <CardActionArea
                onClick={(event) => {
                  selectAddress(item.id);
                }}
              >
                <CardContent>
                  <Typography gutterBottom>{item.kind}</Typography>
                  <Typography gutterBottom>
                    {item.name} - {item.phone}
                  </Typography>
                  <Typography gutterBottom>{item.addressFirstLine}</Typography>
                  <Typography gutterBottom>
                    {item.city.name} {item.city.state} {item.pincode}
                  </Typography>
                </CardContent>
              </CardActionArea>

              <CardActions>
                <Button size="small" color="primary" disabled>
                  Edit
                </Button>
                <Button size="small" color="primary" disabled>
                  Remove
                </Button>
              </CardActions>
            </Card>
          </Grid>
        ))}
      </Grid>
      <CreateAddressForm setAddresses={setAddresses} />
    </Container>
  );
};

export default ChooseAddress;
