import React from "react";
import { createRoot } from "react-dom/client";
import { Provider } from "react-redux";
import { Route, Routes, BrowserRouter as Router } from "react-router";
import Items from "components/Items/Items";
// import VendorsListing from 'components/Vendors/VendorsListing';
import configureStore from "configureStore";
import { APP_URLS } from "constants/common";
import ModalManager from "components/ModalManager";
import Ecommerce from "components/Ecommerce/Ecommerce";
import "bootstrap/dist/css/bootstrap.min.css";
import Checkout from "components/Ecommerce/Checkout";
import withHeaderFooter from "components/HOCs/withHeaderFooter";
import ChooseAddress from "components/Ecommerce/ChooseAddress";
import EcommOrders from "components/Ecommerce/Orders/Orders";
import ReviewOrder from "components/Ecommerce/ReviewOrder/ReviewOrder";
import Confirmation from "components/Ecommerce/Confirmation";
import withCheckoutFlowSteppers from "components/HOCs/withCheckoutFlowSteppers";
import Notification from "components/Notification";
import NotFoundComponent from "components/404";
import SpecialOffers from "components/Ecommerce/SpecialOffers/SpecialOffers";
import ItemDetail from "components/Ecommerce/ItemDetail/ItemDetail";
import OrderDetails from "components/Ecommerce/OrderDetails";
import ContactUs from "components/ContactUs/ContactUs";
import UserAccount from "components/Ecommerce/UserAccount/UserAccount";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterLuxon } from "@mui/x-date-pickers/AdapterLuxon";

import "./index.scss";

const store = configureStore({});

const routes = (
  <Provider store={store}>
    {/* <ModalManager />
    <Notification /> */}
    <LocalizationProvider dateAdapter={AdapterLuxon}>
      <Router>
        <Routes>
          {/**** Single Company Ecommerce */}
          <Route
            path={APP_URLS.ecommDashboard}
            Component={withHeaderFooter(Ecommerce)}
          />
          <Route
            path={APP_URLS.ecommOrders}
            Component={withHeaderFooter(EcommOrders)}
          />
          <Route
            path={APP_URLS.ecommAddress}
            Component={withHeaderFooter(
              withCheckoutFlowSteppers(ChooseAddress)
            )}
          />
          <Route
            path={APP_URLS.ecommReview}
            Component={withHeaderFooter(withCheckoutFlowSteppers(ReviewOrder))}
          />
          <Route
            path={APP_URLS.ecommComplete}
            Component={withHeaderFooter(withCheckoutFlowSteppers(Confirmation))}
          />
          <Route
            path={APP_URLS.specialOffers}
            Component={withHeaderFooter(SpecialOffers)}
          />
          <Route
            path={APP_URLS.ecommItemDetails}
            Component={withHeaderFooter(ItemDetail)}
          />
          <Route
            path={APP_URLS.ecommOrderDetails}
            Component={withHeaderFooter(OrderDetails)}
          />
          <Route
            path={APP_URLS.contactUs}
            Component={withHeaderFooter(ContactUs)}
          />
          <Route
            path={APP_URLS.userAccount}
            Component={withHeaderFooter(UserAccount)}
          />
          {/* <Route path={APP_URLS.forgotPassword} component={ForgotPassword} />
            <Route path={APP_URLS.resetPassword} component={ResetPassword} />
            <Route path={APP_URLS.verifyEmail} component={VerifyEmail} /> */}

          {/****Common */}
          {/* <Route exact path={APP_URLS.signup} component={SignUp} />
            <Route exact path={APP_URLS.root} component={SignIn} /> */}
          <Route path="*" Component={NotFoundComponent} />
        </Routes>
      </Router>
    </LocalizationProvider>
  </Provider>
);

const domNode = document.getElementById("root");

const root = createRoot(domNode!, {
  onCaughtError: (error, errorInfo) => {
    console.error("Caught error", error, errorInfo.componentStack);
  },
});
root.render(routes);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
// serviceWorker.unregister();
