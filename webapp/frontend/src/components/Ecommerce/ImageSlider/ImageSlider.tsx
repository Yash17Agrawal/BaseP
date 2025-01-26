import React, { useEffect, useState } from "react";
import Carousel from "react-bootstrap/Carousel";
// import mac from "assets/sale3.jpeg";
import "./carousel.scss";
import { useDispatch } from "react-redux";
import { getMedia } from "actions/ecommerceActions";
import { IGetMediaAPIResponse } from "interfaces/ecommerceInterfaces";

const ImageSlider = () => {
  const dispatch = useDispatch();
  const [data, setData] = useState<IGetMediaAPIResponse[]>([]);
  useEffect(() => {
    dispatch(getMedia("BANNER", "home", setData));
  }, []);
  return (
    <Carousel className="rbimageslider" interval={3000}>
      {data.map((obj) => {
        return (
          <Carousel.Item>
            <img className="d-block w-100" src={obj.file} alt="First slide" />
            <Carousel.Caption>
              <h3>{obj.label}</h3>
              <p>{obj.description}</p>
            </Carousel.Caption>
          </Carousel.Item>
        );
      })}
    </Carousel>
  );
};

export default ImageSlider;
