import React, { useEffect, useState } from "react";
import Grid from "@mui/material/Grid";
import Typography from "@mui/material/Typography";
import TextField from "@mui/material/TextField";
import {
  Button,
  Container,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
} from "@mui/material";
import { useNavigate } from "react-router";
import { useDispatch } from "react-redux";
import {
  createAddress,
  getAddresses,
  getCities,
  getRegion,
} from "actions/ecommerceActions";
import {
  IAddressAPIResponse,
  ICityAPIResponseObject,
} from "interfaces/ecommerceInterfaces";
import "./createAddress.scss";

interface IProps {
  setAddresses: (data: IAddressAPIResponse[]) => void;
}

const CreateAddressForm: React.FC<IProps> = (props) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [addressFirstLine, setAddressFirstLine] = useState("");
  const [addressSecondLine, setAddressSecondLine] = useState("");
  const [city, setCity] = useState("");
  const [cities, setCities] = useState<ICityAPIResponseObject[]>([]);
  const [kind, setKind] = useState("Home");
  const [pincode, setPincode] = useState("");
  const [name, setName] = useState("");
  const [contactNumber, setContactNumber] = useState("");
  const [state, setState] = useState("");

  useEffect(() => {
    dispatch(getCities(setCities));
  }, []);

  useEffect(() => {
    if (city.trim().length !== 0) {
      dispatch(getRegion(city, setState));
    }
  }, [city]);

  const emptyFields = () => {
    setAddressFirstLine("");
    setAddressSecondLine("");
    setKind("Home");
    setPincode("");
    setName("");
    setContactNumber("");
  };

  const onChangeView = () => {
    dispatch(
      createAddress(
        {
          addressFirstLine,
          addressSecondLine,
          city,
          kind,
          name: `${name}`,
          pincode,
          phone: contactNumber,
        },
        () => {
          dispatch(getAddresses(props.setAddresses));
          emptyFields();
        }
      )
    );
  };

  return (
    <Container className={"container"}>
      <Typography variant="h6" gutterBottom>
        New Shipping address
      </Typography>
      <Grid container>
        <Grid item xs={12} sm={6}>
          <TextField
            required
            id="firstName"
            name="firstName"
            label="First name"
            fullWidth
            value={name}
            autoComplete="fname"
            onChange={(event) => {
              setName(event.target.value);
            }}
          />
        </Grid>
        <Grid item xs={12} sm={6}>
          <TextField
            required
            id="contactNumber"
            name="contactNumber"
            label="Contact Number"
            fullWidth
            value={contactNumber}
            autoComplete="contactNumber number"
            onChange={(event) => {
              setContactNumber(event.target.value);
            }}
          />
        </Grid>
        <Grid item xs={12} sm={6}>
          <TextField
            required
            id="address1"
            name="address1"
            label="Address line 1"
            fullWidth
            value={addressFirstLine}
            autoComplete="billing address-line1"
            onChange={(event) => {
              setAddressFirstLine(event.target.value);
            }}
          />
        </Grid>
        <Grid item xs={12} sm={6}>
          <TextField
            id="address2"
            name="address2"
            label="Address line 2"
            fullWidth
            value={addressSecondLine}
            autoComplete="billing address-line2"
            onChange={(event) => {
              setAddressSecondLine(event.target.value);
            }}
          />
        </Grid>
        <Grid item xs={12} sm={6}>
          <FormControl fullWidth>
            <InputLabel id="demo-simple-select-label">City</InputLabel>
            <Select
              labelId="demo-simple-select-label"
              id="demo-simple-select"
              value={city}
              label="City"
              onChange={(event) => {
                setCity(event.target.value as string);
              }}
            >
              {cities.map((city) => {
                return (
                  <MenuItem value={city.name} key={city.name}>
                    {city.name}
                  </MenuItem>
                );
              })}
            </Select>
          </FormControl>
        </Grid>
        <Grid item xs={12} sm={6}>
          <TextField
            id="state"
            name="state"
            value={state}
            disabled
            label="State/Province/Region"
            aria-readonly
            fullWidth
          />
        </Grid>
        <Grid item xs={12} sm={6}>
          <TextField
            required
            id="zip"
            name="zip"
            label="Zip / Postal code"
            fullWidth
            value={pincode}
            autoComplete="billing postal-code"
            onChange={(event) => {
              setPincode(event.target.value);
            }}
          />
        </Grid>
        <Grid item xs={12} sm={6}>
          <FormControl fullWidth>
            <InputLabel id="demo-select-label">Address Type</InputLabel>
            <Select
              labelId="demo-select-label"
              id="demo-select"
              value={kind}
              label="Address Type"
              onChange={(event) => {
                setKind(event.target.value as string);
              }}
            >
              {["Home", "Office"].map((type: string) => {
                return (
                  <MenuItem value={type} key={type}>
                    {type}
                  </MenuItem>
                );
              })}
            </Select>
          </FormControl>
        </Grid>
      </Grid>
      <Button
        className={"createButton"}
        variant="contained"
        color="primary"
        onClick={onChangeView}
      >
        Create
      </Button>
    </Container>
  );
};

export default CreateAddressForm;
