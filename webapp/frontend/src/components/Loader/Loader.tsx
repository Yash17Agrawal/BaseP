import React from "react";
import { Backdrop, CircularProgress } from "@mui/material";
import { useSelector } from "react-redux";
import { IReducers } from "interfaces/commonInterfaces";
import "./loader.scss";

const Loader: React.FC<any> = (props) => {
  const modalReducer = useSelector((state: IReducers) => state.modalReducer);

  return (
    <Backdrop className="loader-component" open={modalReducer.show}>
      <CircularProgress color="secondary" size={50} thickness={5} />
    </Backdrop>
  );
};

export default Loader;
