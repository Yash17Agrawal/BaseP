import React, { useState } from "react";
import Button from "@mui/material/Button";
import Card from "@mui/material/Card";
import CardActions from "@mui/material/CardActions";
import CardContent from "@mui/material/CardContent";
import CardMedia from "@mui/material/CardMedia";
import CssBaseline from "@mui/material/CssBaseline";
import Grid from "@mui/material/Grid";
import Typography from "@mui/material/Typography";
import Container from "@mui/material/Container";
import { useDispatch, useSelector } from "react-redux";
import { IReducers, IItem, ICartItem } from "interfaces/commonInterfaces";
import { useNavigate } from "react-router";

// const useStyles = makeStyles((theme) => ({
//   icon: {
//     marginRight: theme.spacing(2),
//   },
//   heroContent: {
//     backgroundColor: theme.palette.background.paper,
//     padding: theme.spacing(8, 0, 6),
//   },
//   heroButtons: {
//     marginTop: theme.spacing(4),
//   },
//   cardGrid: {
//     paddingTop: theme.spacing(8),
//     paddingBottom: theme.spacing(8),
//   },
//   item: {
//     height: "100%",
//     display: "flex",
//     flexDirection: "column",
//   },
//   cardMedia: {
//     paddingTop: "56.25%", // 16:9
//   },
//   cardContent: {
//     flexGrow: 1,
//   },
// }));

const Items = () => {
  const dispatch = useDispatch();
  const items = useSelector(
    (state: IReducers) => state.itemReducer.items as IItem[]
  );
  const [quantities, setQuantities] = useState<ICartItem>({});
  const cartItems = useSelector((state: IReducers) => state.cartReducer);

  const updateQuantity = (item: IItem, type: string) => {
    let temp = { ...quantities };
    switch (type) {
      case "ADD":
        if (temp.hasOwnProperty(item.id)) {
          temp[item.id] = temp[item.id] + 1;
        } else {
          temp[item.id] = 1;
        }
        // dispatch(addCartItem(item));
        break;
      case "REMOVE":
        if (temp[item.id] > 0) {
          temp[item.id] = temp[item.id] - 1;
        }
        if (temp[item.id] === 0) {
          delete temp[item.id];
        }
        // dispatch(removeCartItem(item));
        break;
    }
    setQuantities(temp);
  };
  let navigate = useNavigate();

  const checkout = () => {
    let path = `checkout`;
    navigate(path);
  };

  // useEffect(() => {
  //   dispatch(getItems());
  // }, [])

  return (
    <React.Fragment>
      <CssBaseline />
      <main>
        <Grid container spacing={2}>
          <Grid item>
            <Button variant="contained" color="primary" onClick={checkout}>
              Checkout
            </Button>
          </Grid>
        </Grid>
        <Container className={"cardGrid"} maxWidth="md">
          {/* End hero unit */}
          <Grid container spacing={4}>
            {items.map((item: IItem) => (
              <Grid item key={item.id} xs={12} sm={6} md={4}>
                <Card className={"item"}>
                  <CardMedia
                    className={"cardMedia"}
                    image="https://source.unsplash.com/random"
                    title="Image title"
                  />
                  <CardContent className={"cardContent"}>
                    <Typography gutterBottom variant="h5" component="h2">
                      {item.name}
                    </Typography>
                    <Typography>{item.description}</Typography>
                  </CardContent>
                  <CardActions>
                    <Button
                      size="small"
                      color="primary"
                      onClick={() => updateQuantity(item, "ADD")}
                    >
                      ADD
                    </Button>
                    <Button
                      size="small"
                      color="primary"
                      onClick={() => updateQuantity(item, "REMOVE")}
                      disabled={cartItems.items[item.id] === undefined}
                    >
                      Remove
                    </Button>
                    <React.Fragment>{quantities[item.id]}</React.Fragment>
                  </CardActions>
                </Card>
              </Grid>
            ))}
          </Grid>
        </Container>
      </main>
    </React.Fragment>
  );
};

export default Items;
