import React, { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { IGetOrdersAPIResponse } from "interfaces/ecommerceInterfaces";
import { getUsersOrders } from "actions/ecommerceActions";
import {
  Grid,
  CardMedia,
  CardContent,
  Typography,
  Card,
  Popover,
  Link,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
} from "@mui/material";
import { LazyLoadImage } from "react-lazy-load-image-component";
import { convertDateFromISO } from "utilities";
import { Pagination } from "@mui/lab";
import Loader from "components/Loader/Loader";
import { useNavigate } from "react-router";
import "./orders.scss";

const Orders = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [orders, setOrders] = useState<IGetOrdersAPIResponse>({
    pageNo: 1,
    pageSize: 10,
  } as IGetOrdersAPIResponse);

  useEffect(() => {
    dispatch(getUsersOrders(orders.pageSize, orders.pageNo, setOrders));
  }, []);

  const [anchorEl, setAnchorEl] = React.useState<HTMLElement | null>(null);
  const open = false;

  const handlePopoverOpen = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handlePopoverClose = () => {
    setAnchorEl(null);
  };

  return (
    <div>
      <Loader />
      <Grid container className={"cardGrid"}>
        <Grid item className={"title"} sm={8} md={8}>
          <Typography variant="h4">Your Orders</Typography>
        </Grid>
        {orders &&
          orders.data &&
          orders.data.map((order) => (
            <Grid item key={order.id} xs={11} sm={8} md={8}>
              <Card className={"card"}>
                <div className={"boxInner"}>
                  <div className={"boxInnerLeft"}>
                    <div className={"boxInnerColumn"}>
                      <Typography>Order Placed</Typography>
                      <Typography>
                        {convertDateFromISO(order.createdDate)}
                      </Typography>
                    </div>
                    <div className={"boxInnerColumn"}>
                      <Typography>Total</Typography>
                      <Typography>{order.payment}</Typography>
                    </div>
                    <div className={"boxInnerColumn"}>
                      <Typography>Ship To</Typography>
                      <Typography
                        onMouseEnter={handlePopoverOpen}
                        onMouseLeave={handlePopoverClose}
                      >
                        <Link>{order.deliveryAddress.name}</Link>
                      </Typography>
                      <Popover
                        id={`mouse-over-popover-${order.id}`}
                        className={"popover"}
                        open={open}
                        anchorEl={anchorEl}
                        anchorOrigin={{
                          vertical: "bottom",
                          horizontal: "left",
                        }}
                        transformOrigin={{
                          vertical: "top",
                          horizontal: "left",
                        }}
                        onClose={handlePopoverClose}
                        disableRestoreFocus
                      >
                        <Typography>
                          {order.deliveryAddress.addressFirstLine}
                        </Typography>
                        <Typography>{order.deliveryAddress.pincode}</Typography>
                      </Popover>
                    </div>
                  </div>
                  <div className={"boxInnerRight"}>
                    <div className={"boxInnerColumn"}>
                      <Link href={`/ecomm/order/${order.id}/`}>
                        <Typography>Order # {order.id}</Typography>
                      </Link>
                      {/* <Typography>View Order Details </Typography> */}
                    </div>
                  </div>
                </div>
                <CardContent className={"cardContent"}>
                  <div className={"subItemLeft"}>
                    <Typography>
                      {order.status} on {convertDateFromISO(order.modifiedDate)}
                    </Typography>
                    <Typography>Total Bill: {order.totalBill}</Typography>
                    <Typography>Total Amount Paid: {order.payment}</Typography>
                  </div>
                  <div className={"subItemRight"}>
                    {order.items.map((item) => {
                      return (
                        <div
                          className={"subItemRightRow"}
                          onClick={() => {
                            navigate(`/ecomm/item/${item.id}`);
                          }}
                        >
                          <LazyLoadImage
                            src={"https://picsum.photos/id/235/500/500"}
                            style={{ height: "100px", width: "100px" }}
                          />
                          <CardContent className={"cardContent"}>
                            <Typography>
                              {item.name} {item.description}{" "}
                            </Typography>
                          </CardContent>
                        </div>
                      );
                    })}
                  </div>
                </CardContent>
              </Card>
            </Grid>
          ))}
        <Grid
          item
          key={"random-key"}
          xs={11}
          sm={8}
          md={8}
          className={"paginationOptions"}
        >
          <FormControl className={"rowsPerPage"}>
            <InputLabel id="demo-simple-select-label">Rows Per Page</InputLabel>
            <Select
              labelId="demo-simple-select-label"
              id="demo-simple-select"
              value={orders.pageSize}
              onChange={(event) => {
                dispatch(
                  getUsersOrders(
                    parseInt(event?.target?.value as string),
                    orders.pageNo,
                    setOrders
                  )
                );
              }}
            >
              <MenuItem value={10}>10</MenuItem>
              <MenuItem value={20}>20</MenuItem>
              <MenuItem value={30}>30</MenuItem>
            </Select>
          </FormControl>
          <Pagination
            // Page count
            count={
              orders.totalRecords % orders.pageSize === 0
                ? orders.totalRecords / orders.pageSize
                : Math.ceil(orders.totalRecords / orders.pageSize)
            }
            size="small"
            onChange={(event, pageNumber) => {
              dispatch(getUsersOrders(orders.pageSize, pageNumber, setOrders));
            }}
          />
        </Grid>
      </Grid>
    </div>
  );
};

export default Orders;
