import Header from "components/Customer/Header/Header";
import Footer from "components/Footer";
import Loader from "components/Loader/Loader";
import React, { Suspense } from "react";

export default function withHeaderFooter(Component: React.ComponentType) {
  class Wrapped extends React.Component<any> {
    render() {
      return (
        <React.Fragment>
          <Header />
          <Suspense fallback={<Loader />}>
            <Component {...this.props} />
          </Suspense>
          <Footer />
        </React.Fragment>
      );
    }
  }
  return Wrapped;
}
