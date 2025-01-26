import React from "react";
import Loader from "components/Loader/Loader";
import "components/Loader/loader.scss";
import { IProps } from "components/Ecommerce/ChooseAddress";

export default function withLoader(Component: React.ComponentType<IProps>) {
  return (props: any) => {
    return (
      <>
        <Loader />
        <Component {...props} />
      </>
    );
  };
}
