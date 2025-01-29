import React, { useEffect, useState } from "react";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import CardMedia from "@mui/material/CardMedia";
import CssBaseline from "@mui/material/CssBaseline";
import Grid from "@mui/material/Grid";
import Typography from "@mui/material/Typography";
import Container from "@mui/material/Container";
import { useDispatch, useSelector } from "react-redux";

import {
  getCategorys,
  getItems,
  updateCartItems,
} from "actions/ecommerceActions";
import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Button,
  CardActionArea,
  CardActions,
  Divider,
  IconButton,
  TextField,
  Tooltip,
} from "@mui/material";
import { HIDE_MODAL, SHOW_MODAL } from "actions/ModalActions";
import { ModalType } from "constants/modalTypes";
import { IItem } from "interfaces/ecommerceInterfaces";
import { ICartItem, IReducers } from "interfaces/commonInterfaces";
import { APP_URLS } from "constants/common";
import { useNavigate } from "react-router";
import { LazyLoadImage } from "react-lazy-load-image-component";
import ExpandMoreIcon from "@mui/icons-material/ExpandMoreOutlined";
import SortIcon from "@mui/icons-material/Sort";
import { ACTION_TYPES } from "constants/actionTypes";
import RBImageSlider from "./ImageSlider/ImageSlider";
import Loader from "components/Loader/Loader";
import { addItemToCartData, deleteCartItem } from "utilities";
import "./Ecommerce.scss";

const Ecommerce = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const itemReducer = useSelector((state: IReducers) => state.itemReducer);
  const cartReducer = useSelector((state: IReducers) => state.cartReducer);
  const [orderLowToHigh, setOrderLowToHigh] = useState<boolean>(false);

  const removeCartItem = (
    removeItemId: number
  ): { items: ICartItem; itemsCartSequence: Array<number> } => {
    let removeTempItems = { ...cartReducer.items };
    if (removeTempItems[removeItemId] - 1 === 0) {
      return deleteCartItem(
        removeItemId,
        cartReducer.items,
        cartReducer.itemsCartSequence
      );
    } else {
      removeTempItems[removeItemId] = removeTempItems[removeItemId] - 1;
      return {
        items: removeTempItems,
        itemsCartSequence: cartReducer.itemsCartSequence,
      };
    }
  };

  const updateQuantity = (item: IItem, type: string) => {
    switch (type) {
      case "ADD":
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
        break;
      case "REMOVE":
        const { items: a } = removeCartItem(item.id);
        dispatch(
          updateCartItems({
            items: Object.keys(a).map((itemId: string) => {
              return {
                id: parseInt(itemId),
                quantity: a[parseInt(itemId)],
              };
            }),
          })
        );
        break;
    }
  };
  useEffect(() => {
    dispatch(getCategorys());
    dispatch(getItems());
  }, []);

  const sortForPrice = () => {
    let data: IItem[] = itemReducer.items as IItem[];
    if (orderLowToHigh) {
      // Sort High to Low
      setOrderLowToHigh(false);
      data.sort((a, b) =>
        parseFloat(a.offerPrice) > parseFloat(b.offerPrice) ? -1 : 1
      );
    } else {
      // Sort Low to High
      setOrderLowToHigh(true);
      data.sort((a, b) =>
        parseFloat(a.offerPrice) > parseFloat(b.offerPrice) ? 1 : -1
      );
    }

    dispatch({
      type: ACTION_TYPES.SET_ITEMS,
      payload: { items: data },
    });
  };

  const getSortToolTip = () => {
    let msg = "Low to High";
    if (orderLowToHigh) msg = "High to Low";
    return `Sort by Rebate Price - ${msg}`;
  };

  return (
    <React.Fragment>
      <CssBaseline />
      <Loader />
      <Container className={"cardGrid"} maxWidth="lg">
        <RBImageSlider />
        <div className={"buttons"}>
          <Tooltip title={getSortToolTip()}>
            <IconButton color="inherit" onClick={sortForPrice} size="large">
              <SortIcon />
            </IconButton>
          </Tooltip>
        </div>
        {itemReducer.categorys.map((category) => {
          return (
            <Accordion defaultExpanded>
              <AccordionSummary
                expandIcon={<ExpandMoreIcon />}
                aria-controls="panel1a-content"
                id="panel1a-header"
              >
                <Typography>{category.name}</Typography>
              </AccordionSummary>
              <AccordionDetails>
                <Grid container spacing={4}>
                  {(itemReducer.items as IItem[])
                    .filter((obj) => obj.category.name === category.name)
                    .map((item: IItem) => {
                      return (
                        <Grid item key={item.id} xs={12} sm={6} md={3}>
                          <Card className={"item"}>
                            <CardActionArea
                            // onClick={() => {
                            //   navigate(`/ecomm/item/${item.id}/`);
                            // }}
                            >
                              <LazyLoadImage
                                visibleByDefault={true}
                                src={"https://picsum.photos/id/235/500/500"}
                              />
                              <CardContent className={"cardContent"}>
                                <Typography className={"name"}>
                                  <div>{item.name}</div>
                                  <div className={"yash"}>
                                    MRP: {item.price}
                                  </div>
                                </Typography>
                                <Typography
                                  gutterBottom
                                  component="h3"
                                  className={"name"}
                                >
                                  <div>Offer Price: </div>
                                  <div>{item.offerPrice}</div>
                                </Typography>
                                <Typography gutterBottom component="h5">
                                  {item.description}
                                </Typography>
                              </CardContent>
                            </CardActionArea>
                            <CardActions>
                              <Button
                                size="small"
                                color="primary"
                                onClick={() => updateQuantity(item, "ADD")}
                                disabled={
                                  cartReducer.items[item.id] >=
                                  item.unitsPerOrder
                                }
                              >
                                ADD
                              </Button>
                              <Button
                                size="small"
                                color="primary"
                                onClick={() => updateQuantity(item, "REMOVE")}
                                disabled={
                                  cartReducer.items[item.id] === undefined
                                }
                              >
                                Remove
                              </Button>
                              <React.Fragment>
                                {cartReducer.items[item.id]}
                              </React.Fragment>
                            </CardActions>
                          </Card>
                        </Grid>
                      );
                    })}
                </Grid>
              </AccordionDetails>
            </Accordion>
          );
        })}
      </Container>
    </React.Fragment>
  );
};

export default Ecommerce;
