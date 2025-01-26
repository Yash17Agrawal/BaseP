import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  Toolbar,
  AppBar,
  Typography,
  Badge,
  IconButton,
  Drawer,
  ListItem,
  ListItemText,
  Link,
  Button,
  CardMedia,
  TextField,
} from "@mui/material";
import NotificationsIcon from "@mui/icons-material/Notifications";
import { IReducers } from "interfaces/commonInterfaces";
import { APP_URLS, localStorageProperties, MESSAGES } from "constants/common";
import {
  getItems,
  getCartItems,
  searchItems,
  getCheckoutData,
} from "actions/ecommerceActions";
import { useNavigate } from "react-router";
// import UserMenu from "components/Vendor/UserMenu/UserMenu";
import { LazyLoadImage } from "react-lazy-load-image-component";
import {
  IGetCheckoutDataAPIResponse,
  IItem,
} from "interfaces/ecommerceInterfaces";
import EmptyData from "components/EmptyData/EmptyData";
import "./header.scss";

const Header = () => {
  const cartReducer = useSelector((state: IReducers) => state.cartReducer);
  const userReducer = useSelector((state: IReducers) => state.userReducer);
  const itemReducer = useSelector((state: IReducers) => state.itemReducer);
  const [search, setSearch] = useState("");
  const [state, setState] = React.useState(false);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const getTotalCartItems = () => {
    let counter = 0;
    cartReducer.itemsCartSequence.forEach((id: number) => {
      counter += cartReducer.items[id];
    });
    return counter;
  };

  const toggleDrawer =
    (open: boolean) => (event: React.KeyboardEvent | React.MouseEvent) => {
      if (
        event.type === "keydown" &&
        ((event as React.KeyboardEvent).key === "Tab" ||
          (event as React.KeyboardEvent).key === "Shift")
      ) {
        return;
      }

      setState(open);
    };

  const getLocalStorageItem = (key: string) => {
    return localStorage.getItem(key);
  };
  const checkLoggedIn = () => {
    return true;
    // const token = getLocalStorageItem(localStorageProperties.accessToken);
    // const refreshToken = getLocalStorageItem(
    //   localStorageProperties.refreshToken
    // );

    // if (
    //   token !== "" &&
    //   refreshToken !== "" &&
    //   token !== null &&
    //   refreshToken !== null &&
    //   token !== undefined &&
    //   refreshToken !== undefined
    // ) {
    //   return true;
    // } else {
    //   return false;
    // }
  };

  const anchor = "left";

  useEffect(() => {
    if (itemReducer.items.length === 0) {
      dispatch(getItems());
    }
    if (checkLoggedIn()) {
      dispatch(getCartItems());
      // dispatch(getUserInfo());
    }
  }, []);

  const red = () => {
    navigate(APP_URLS.ecommDashboard);
  };

  const checkOut = () => {
    dispatch(
      getCheckoutData(
        (data: IGetCheckoutDataAPIResponse) => {
          if (data.deliveryAddress) {
            navigate(APP_URLS.ecommReview);
          } else {
            navigate(APP_URLS.ecommAddress);
          }
        },
        () => {
          navigate(APP_URLS.ecommDashboard);
        }
      )
    );
  };

  return (
    <AppBar position="sticky">
      <Toolbar className="toolbar">
        <Typography
          onClick={red}
          variant="h6"
          color="inherit"
          noWrap
          className={`${"title"}`}
        >
          {MESSAGES.companyName}
        </Typography>
        <TextField
          className={"search"}
          placeholder="Search Items"
          variant="outlined"
          onChange={(event) => {
            setSearch(event.target.value);
            if (event.target.value.trim().length !== 0) {
              dispatch(searchItems(event.target.value));
            } else {
              dispatch(getItems());
            }
          }}
        />
        {checkLoggedIn() ? (
          <div>
            <IconButton
              color="inherit"
              onClick={toggleDrawer(true)}
              size="large"
            >
              <Badge badgeContent={getTotalCartItems()} color="secondary">
                <NotificationsIcon />
              </Badge>
            </IconButton>
            <Button onClick={checkOut} color="inherit" className={`${"title"}`}>
              Checkout
            </Button>
            <Button
              onClick={() => {
                navigate(APP_URLS.ecommOrders);
              }}
              color="inherit"
              className={`${"title"}`}
            >
              Orders
            </Button>
            {/* <UserMenu
              redirectRoute={APP_URLS.ecommDashboard}
              userName={userReducer.firstName}
            /> */}
          </div>
        ) : (
          <div>
            <Button
              onClick={() => {
                navigate(APP_URLS.specialOffers);
              }}
              color="inherit"
              className={`${"title"}`}
            >
              Special Deals
            </Button>
            <Button
              color="inherit"
              onClick={() => {
                navigate(APP_URLS.contactUs);
              }}
              className={`${"title"}`}
            >
              Contact Us
            </Button>
            <Button
              color="inherit"
              onClick={() => {
                navigate(APP_URLS.root);
              }}
              className={`${"title"}`}
            >
              Sign in
            </Button>
          </div>
        )}
        <Drawer anchor={anchor} open={state} onClose={toggleDrawer(false)}>
          <div
            className={"list"}
            role="presentation"
            onClick={toggleDrawer(false)}
            onKeyDown={toggleDrawer(false)}
          >
            {cartReducer.itemsCartSequence.length === 0 ? (
              <EmptyData />
            ) : (
              (itemReducer.items as IItem[]).map((item: IItem) => {
                return (
                  cartReducer.items[item.id] && (
                    <ListItem className={"listItem"} key={item.id}>
                      {cartReducer.items[item.id] > 1 ? (
                        <React.Fragment>
                          <LazyLoadImage
                            alt={"https://picsum.photos/id/235/500/500?blur=10"}
                            src={"https://picsum.photos/id/235/500/500?blur=10"}
                            height={50}
                            width={50}
                          />
                          <ListItemText
                            primary={`${item.name} X ${
                              cartReducer.items[item.id]
                            }`}
                            secondary={item.description}
                          />
                          <Typography variant="body2">
                            {item.offerPrice} X {cartReducer.items[item.id]}
                          </Typography>
                        </React.Fragment>
                      ) : (
                        <React.Fragment>
                          <LazyLoadImage
                            src={"https://picsum.photos/id/235/500/500?blur=10"}
                          />
                          <ListItemText
                            primary={`${item.name}`}
                            secondary={item.description}
                          />
                          <Typography variant="body2">
                            {item.offerPrice}
                          </Typography>
                        </React.Fragment>
                      )}
                    </ListItem>
                  )
                );
              })
            )}
          </div>
        </Drawer>
      </Toolbar>
    </AppBar>
  );
};

export default Header;
