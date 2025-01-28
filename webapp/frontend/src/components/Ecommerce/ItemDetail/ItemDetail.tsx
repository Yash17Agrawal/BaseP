import {
  Button,
  CardMedia,
  Container,
  FormControl,
  Grid,
  InputLabel,
  MenuItem,
  Paper,
  Select,
  TextField,
  Typography,
} from "@mui/material";
import {
  checkPincode,
  getItemDetails,
  showNotification,
  updateCartItems,
} from "actions/ecommerceActions";
import { SYMBOLS } from "constants/common";
import { IReducers } from "interfaces/commonInterfaces";
import { IItem } from "interfaces/ecommerceInterfaces";
import React, { useEffect, useState } from "react";
import { Carousel } from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router";
import { cartReducer } from "reducers/cartReducer";
import { addItemToCartData } from "utilities";
import "./itemDetail.scss";

const ItemDetail = () => {
  const { id } = useParams<{ id: string }>();
  const cartReducer = useSelector((state: IReducers) => state.cartReducer);
  const dispatch = useDispatch();
  const [item, setDetails] = useState<IItem>({} as IItem);
  const [selectedQuantity, setQuantity] = useState<number>(1);
  const [pincode, setPincode] = useState("");
  const [availableInPincode, setAvailableInPincode] = useState<boolean>(true);

  useEffect(() => {
    dispatch(getItemDetails(parseInt(id as string), setDetails));
  }, []);

  const addToCart = () => {
    const { items } = addItemToCartData(
      item.id,
      cartReducer.items,
      cartReducer.itemsCartSequence
    );
    dispatch(
      updateCartItems({
        items: Object.keys(items).map((itemId: string) => {
          return {
            id: parseInt(itemId),
            quantity: items[parseInt(itemId)],
          };
        }),
      })
    );
  };

  const checkPincodeWithItem = () => {
    if (pincode.length !== 0)
      dispatch(
        checkPincode(
          { item: parseInt(id as string), pincode: parseInt(pincode) },
          (isAvailable: boolean) => {
            if (isAvailable) {
              dispatch(
                showNotification("Available in requested Pincode", "success")
              );
              setAvailableInPincode(true);
            } else {
              dispatch(
                showNotification("Not available in requested Pincode", "error")
              );
              setAvailableInPincode(false);
            }
          }
        )
      );
  };

  return (
    <Container className="itemDetailContainer">
      <Paper className="paper">
        <Grid container spacing={6} className="gridContainer">
          <Grid item key={`${item.id}-left`} xs={12} sm={6} md={5}>
            <Carousel className="item-carousel" interval={3000} variant="dark">
              {item.media?.map((media) => {
                return (
                  <Carousel.Item>
                    <img
                      className="d-block w-100 h-100"
                      src={media.file}
                      alt="First slide"
                    />

                    {/* <CardMedia
                      className={"cardMedia"}
                      image={media.file}
                      title={item.name}
                    /> */}
                  </Carousel.Item>
                );
              })}
            </Carousel>
          </Grid>
          <Grid
            item
            key={`${item.id}-right`}
            xs={12}
            sm={6}
            md={7}
            className="right"
          >
            <Typography variant="h3">{item.name}</Typography>
            <Typography variant="h6">{item.description}</Typography>
            <Typography variant="h5" className="mrp-typo">
              MRP: {SYMBOLS.Rupee} <p className="mrp">{item.price}</p>
            </Typography>

            <Typography variant="h5">
              Offer price: {SYMBOLS.Rupee}
              {item.offerPrice}
            </Typography>
            <div>
              <TextField
                placeholder="Pincode"
                error={!availableInPincode}
                type="number"
                helperText={!availableInPincode ? `Invalid Pincode` : ""}
                onChange={(event) => {
                  setPincode(event.target.value);
                }}
              />
              <Button
                variant="contained"
                color="primary"
                disabled={pincode.length === 0}
                onClick={checkPincodeWithItem}
              >
                Check
              </Button>
            </div>
            <FormControl className="qty">
              <InputLabel>Qty</InputLabel>
              <Select
                labelId="demo-simple-select-label"
                value={selectedQuantity}
                onChange={(event: any) => {
                  setQuantity(parseInt(event.target.value));
                }}
              >
                {[...new Array(item.unitsPerOrder)].map((qty, idx) => {
                  return (
                    <MenuItem value={idx + 1} key={idx + 1}>
                      {idx + 1}
                    </MenuItem>
                  );
                })}
              </Select>
            </FormControl>
            <Button variant="contained" color="primary" onClick={addToCart}>
              Add To Cart
            </Button>
          </Grid>
        </Grid>
      </Paper>
    </Container>
  );
};

export default ItemDetail;
