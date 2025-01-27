import React, { useEffect, useState } from "react";
import {
  Grid,
  Typography,
  ListItem,
  List,
  ListItemText,
  Button,
  Container,
  Paper,
  TextField,
  Tooltip,
  IconButton,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  Link,
} from "@mui/material";
import { IReducers } from "interfaces/commonInterfaces";
import { useDispatch, useSelector } from "react-redux";
import { APP_URLS, SYMBOLS } from "constants/common";
import {
  getCartItems,
  getCheckoutData,
  getOrderDetails,
  removeCouponFromUserOrder,
  showNotification,
  updateCartItems,
} from "actions/ecommerceActions";
import { useNavigate, useParams } from "react-router";
import {
  IAddressAPIResponse,
  IGetCartItemsAPIResponse,
  IGetCheckoutDataAPIResponse,
  IItem,
  IUserProfile,
} from "interfaces/ecommerceInterfaces";
import { HIDE_MODAL, SHOW_MODAL } from "actions/ModalActions";
import { ModalType } from "constants/modalTypes";
import Loader from "components/Loader/Loader";
import DeleteIcon from "@mui/icons-material/DeleteOutline";
import ClearIcon from "@mui/icons-material/ClearOutlined";
import { deleteCartItem } from "utilities";
import axios from "axios";
import logo from "../../../logo.svg";
import "./reviewOrder.scss";
import * as EcommerceAPIService from "services/EcommerceAPIs";

interface IProps {
  isReadOnly?: boolean;
}
const ReviewOrder = (props: IProps) => {
  const [data, setData] = useState<IGetCheckoutDataAPIResponse>(
    {} as IGetCheckoutDataAPIResponse
  );

  const [couponName, setCouponName] = useState("");

  const navigate = useNavigate();
  const dispatch = useDispatch();
  const cartReducer = useSelector((state: IReducers) => state.cartReducer);
  const userReducer = useSelector(
    (state: IReducers) => state.userReducer as IUserProfile
  );

  const updateQuantity = (itemIdToUpdate: number, qty: number) => {
    dispatch(
      updateCartItems({
        items: Object.keys(cartReducer.items).map((itemId: string) => {
          return {
            id: parseInt(itemId),
            quantity:
              parseInt(itemId) === itemIdToUpdate
                ? qty
                : cartReducer.items[parseInt(itemId)],
          };
        }),
      })
    );
  };

  const removeItem = (itemId: number) => {
    const { items } = deleteCartItem(
      itemId,
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

  const removeCoupon = () => {
    dispatch(removeCouponFromUserOrder(setData));
  };

  // const onChangeView = () => {
  //   dispatch(
  //     placeUserOrder(couponName, () => {
  //       navigate(APP_URLS.ecommComplete);
  //     })
  //   );
  // };
  const { id } = useParams<{ id: string }>();
  useEffect(() => {
    if (props.isReadOnly) {
      dispatch(
        getOrderDetails(parseInt(id as string), setData, () => {
          navigate(APP_URLS.ecommDashboard);
        })
      );
    } else {
      dispatch(
        getCheckoutData(setData, () => {
          navigate(APP_URLS.ecommDashboard);
        })
      );
    }
  }, []);

  useEffect(() => {
    if (!props.isReadOnly) {
      dispatch(
        getCheckoutData(setData, () => {
          navigate(APP_URLS.ecommDashboard);
        })
      );
    }
  }, [cartReducer.items]);

  const applyCoupon = (event: any) => {
    event.preventDefault();
    dispatch(
      getCheckoutData(
        setData,
        () => {
          navigate(APP_URLS.ecommDashboard);
        },
        couponName
      )
    );
  };

  //Function to load razorpay script for the display of razorpay payment SDK.
  const loadRazorpayScript = async (src: any) => {
    return new Promise((resolve) => {
      const script = document.createElement("script");
      script.src = src;
      script.onload = () => {
        resolve(true);
      };
      script.onerror = () => {
        resolve(false);
      };
      document.body.appendChild(script);
    });
  };

  const displayRazorpayPaymentSdk = async () => {
    const res = await loadRazorpayScript(
      "https://checkout.razorpay.com/v1/checkout.js"
    );

    if (!res) {
      alert("Razorpay SDK failed to load. please check are you online?");
      return;
    }

    // creating a new order and sending order ID to backend
    const result = await EcommerceAPIService.createRazorpayOrder();
    if (!result) {
      alert("Server error. please check are you online?");
      return;
    }

    // Getting the order details back
    const {
      merchantId = null,
      amount = null,
      currency = null,
      orderId = null,
      name,
      description,
      callbackUrl,
      address,
    } = result.data;

    const options = {
      key: merchantId,
      amount: amount.toString(),
      currency: currency,
      name,
      description,
      image: { logo },
      order_id: orderId,
      callback_url: callbackUrl,
      redirect: true,
      prefill: {
        name: "Yash",
        email: "yash17agrawal@gmail.com",
        contact: "",
      },
      notes: {
        address,
      },
      theme: {
        color: "#61dafb",
      },
    };

    // @ts-ignore
    const paymentObject = new window.Razorpay(options);
    paymentObject.open();
  };

  return (
    <Container className={"container"} component="main">
      <Loader />
      {Object.keys(data).length !== 0 ? (
        <React.Fragment>
          <Typography variant="h6" gutterBottom>
            Order summary
          </Typography>
          <List disablePadding>
            {data.items.map((item) => {
              return (
                <Grid
                  container
                  className={`${"listItem"} ${
                    data.availabilityErrors[item.id] ? "strikeThrough" : ""
                  }`}
                  key={item.id}
                  spacing={2}
                >
                  <Grid
                    item
                    sm={6}
                    xs={6}
                    lg={!props.isReadOnly ? 5 : 6}
                    md={!props.isReadOnly ? 5 : 6}
                  >
                    <Typography>{item.name}</Typography>
                    <Typography className={"description"}>
                      {item.description}
                    </Typography>
                  </Grid>
                  <Grid item sm={2} xs={2} lg={2} md={2}>
                    <Typography variant="body2">{item.offerPrice}</Typography>
                  </Grid>
                  <Grid item sm={2} xs={2} lg={2} md={2}>
                    {!props.isReadOnly ? (
                      <FormControl className="qty">
                        <InputLabel>Qty</InputLabel>
                        <Select
                          labelId="demo-simple-select-label"
                          value={item.quantity}
                          onChange={(event: any) => {
                            updateQuantity(item.id, event.target.value);
                          }}
                        >
                          {[...new Array(item.unitsPerOrder)].map(
                            (qty, idx) => {
                              return (
                                <MenuItem value={idx + 1} key={idx + 1}>
                                  {idx + 1}
                                </MenuItem>
                              );
                            }
                          )}
                        </Select>
                      </FormControl>
                    ) : (
                      <MenuItem value={item.quantity} key={item.quantity}>
                        {item.quantity}
                      </MenuItem>
                    )}
                  </Grid>
                  <Grid item sm={2} xs={2} lg={2} md={2}>
                    <Typography variant="body2">
                      {item.totalOfferPrice}
                    </Typography>
                  </Grid>
                  {!props.isReadOnly && (
                    <Grid item sm={1} xs={1} lg={1} md={1}>
                      <IconButton
                        aria-label="delete"
                        onClick={() => {
                          removeItem(item.id);
                        }}
                        size="large"
                      >
                        <DeleteIcon />
                      </IconButton>
                    </Grid>
                  )}
                </Grid>
              );
            })}
            <ListItem className={"listItem"}>
              <ListItemText primary="Total" />
              <Typography variant="subtitle1" className={"total"}>
                {SYMBOLS.Rupee} {data.total}
              </Typography>
            </ListItem>
            <ListItem className={"listItem"}>
              <ListItemText primary="Delivery Charge" />
              <Typography variant="subtitle1" className={"total"}>
                {data.deliveryCharge
                  ? `${SYMBOLS.Rupee} ${data.deliveryCharge}`
                  : "Free"}
              </Typography>
            </ListItem>
            {data.discount ? (
              <ListItem className={"listItem"}>
                <ListItemText primary="Discount" />
                <Typography variant="subtitle1" className={"total"}>
                  {`${SYMBOLS.Rupee} ${data.discount}`}
                </Typography>
              </ListItem>
            ) : null}
            {data.total !== data.payment ? (
              <ListItem className={"listItem"}>
                <ListItemText primary="Payable" />
                <Typography variant="subtitle1" className={"total"}>
                  {SYMBOLS.Rupee} {data.payment}
                </Typography>
              </ListItem>
            ) : null}
            {data.appliedCoupon && data.appliedCoupon.length !== 0 ? (
              <ListItem className={"listItem"}>
                <ListItemText primary="Applied Coupon" />
                <Typography variant="subtitle1" className={"total"}>
                  {data.discount ? (
                    <IconButton
                      aria-label="delete"
                      onClick={removeCoupon}
                      size="large"
                    >
                      <ClearIcon />
                    </IconButton>
                  ) : null}
                  {data.appliedCoupon}
                </Typography>
              </ListItem>
            ) : null}
          </List>
          <Grid container>
            <Grid item xs={12} sm={9}>
              <Typography variant="h6" gutterBottom className={"title"}>
                Shipping Address
                {!props.isReadOnly && (
                  <Link href={APP_URLS.ecommAddress}>Change</Link>
                )}
              </Typography>
              <Typography gutterBottom>{data.deliveryAddress.name}</Typography>
              <Typography gutterBottom>{data.deliveryAddress.kind}</Typography>
              <Typography gutterBottom>
                {data.deliveryAddress.addressFirstLine}{" "}
                {data.deliveryAddress.addressSecondLine}
              </Typography>
              <Typography gutterBottom>
                {data.deliveryAddress.city.name}
              </Typography>
              <Typography gutterBottom>
                {data.deliveryAddress.pincode}
              </Typography>
            </Grid>
            {!props.isReadOnly && (
              <Grid item xs={12} sm={3} className={"placeOrderGrid"}>
                <Grid item xs={12} sm={12}>
                  <form onSubmit={applyCoupon} className={"coupon"}>
                    <Button
                      type="submit"
                      variant="contained"
                      color="primary"
                      style={{ marginBottom: "1em" }}
                    >
                      Apply
                    </Button>
                    <TextField
                      id="coupon"
                      label="Coupon"
                      variant="standard"
                      required
                      onChange={(event) => {
                        // if (event.target.value.trim().length !== 0) {
                        setCouponName(event.target.value);
                        // } else {
                        //   dispatch(
                        //     getCheckoutData(setData, () => {
                        //       navigate(APP_URLS.ecommDashboard);
                        //     })
                        //   );
                        // }
                      }}
                    />
                  </form>
                </Grid>
                <Grid item xs={12} sm={12}>
                  <Tooltip title="Remove unserviceable items from cart">
                    <span>
                      <Button
                        variant="contained"
                        color="primary"
                        disabled={
                          Object.keys(data.availabilityErrors).length !== 0
                        }
                        onClick={displayRazorpayPaymentSdk}
                      >
                        Place Order
                      </Button>
                    </span>
                  </Tooltip>
                </Grid>
              </Grid>
            )}
          </Grid>
        </React.Fragment>
      ) : (
        <></>
      )}
    </Container>
  );
};

export default ReviewOrder;
