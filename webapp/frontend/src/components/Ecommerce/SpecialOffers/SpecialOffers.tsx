import React, { useEffect } from "react";
import {
  Container,
  //   IconButton,
  ImageList,
  ImageListItem,
  ImageListItemBar,
  //   ListSubheader,
} from "@mui/material";
// import InfoIcon from "@mui/icons-material/Info";
import { useDispatch, useSelector } from "react-redux";
import { getItems } from "actions/ecommerceActions";
import { IItem } from "interfaces/ecommerceInterfaces";
import { IReducers } from "interfaces/commonInterfaces";
import { useNavigate } from "react-router";

const SpecialOffers = () => {
  const dispatch = useDispatch();
  const history = useNavigate();

  const itemReducer = useSelector((state: IReducers) => state.itemReducer);

  useEffect(() => {
    // TODO: Replace with relevant APIs
    dispatch(getItems());
  }, []);

  return (
    <Container>
      <ImageList
        style={{ width: 500, height: 450, cursor: "pointer" }}
        cols={3}
      >
        {(itemReducer.items as IItem[]).map((item) => (
          <ImageListItem
            key={item.id}
            onClick={() => {
              history(`/ecomm/item/${item.id}/`);
            }}
          >
            {item.media && item.media.length > 0 ? (
              <img
                src={`${item.media[0].file}?w=248&fit=crop&auto=format`}
                srcSet={`${item.media[0].file}?w=248&fit=crop&auto=format&dpr=2 2x`}
                alt={item.name}
                loading="lazy"
              />
            ) : null}
            <ImageListItemBar
              title={item.name}
              subtitle={item.description}
              //   actionIcon={
              //     <IconButton aria-label={`info about ${item.name}`}>
              //       <InfoIcon />
              //     </IconButton>
              //   }
            />
          </ImageListItem>
        ))}
      </ImageList>
    </Container>
  );
};

export default SpecialOffers;
