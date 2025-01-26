import { Button, IconButton, Snackbar } from "@mui/material";
import * as React from "react";
import CloseIcon from "@mui/icons-material/CloseOutlined";
import { useDispatch, useSelector } from "react-redux";
import { IReducers } from "interfaces/commonInterfaces";
import { ACTION_TYPES } from "constants/actionTypes";
import { Alert } from "@mui/material";

export interface SnackbarMessage {
  message: string;
  key: number;
  duration: number;
  severity: "warning" | "error" | "success";
}

const Notification = () => {
  const notifications = useSelector(
    (selector: IReducers) => selector.notificationReducer
  );

  const dispatch = useDispatch();

  const [open, setOpen] = React.useState(false);
  const [messageInfo, setMessageInfo] = React.useState<
    SnackbarMessage | undefined
  >(undefined);

  React.useEffect(() => {
    if (notifications.messages.length && !messageInfo) {
      // Set a new snack when we don't have an active one
      setMessageInfo({ ...notifications.messages[0] });
      dispatch({
        type: ACTION_TYPES.SET_NOTIFICATIONS,
        payload: notifications.messages.slice(1),
      });
      setOpen(true);
    } else if (notifications.messages.length && messageInfo && open) {
      // Close an active snack when a new one is added
      //   setOpen(false);
    }
  }, [notifications.messages, messageInfo, open]);

  const handleClose = (
    event: React.SyntheticEvent | Event,
    reason?: string
  ) => {
    if (reason === "clickaway") {
      return;
    }
    setOpen(false);
  };

  const handleExited = () => {
    setMessageInfo(undefined);
  };

  return (
    // <Snackbar
    //   key={messageInfo ? messageInfo.key : undefined}
    //   open={open}
    //   autoHideDuration={1000}
    //   onClose={handleClose}
    //   TransitionProps={{ onExited: handleExited }}
    //   message={messageInfo ? messageInfo.message : undefined}
    //   action={
    //     <React.Fragment>
    //       {/* <Button color="secondary" size="small" onClick={handleClose}>
    //         UNDO
    //       </Button> */}
    //       <IconButton color="inherit" onClick={handleClose}>
    //         <CloseIcon />
    //       </IconButton>
    //     </React.Fragment>
    //   }
    // />
    <Snackbar
      key={messageInfo ? messageInfo.key : undefined}
      open={open}
      autoHideDuration={messageInfo?.duration ? messageInfo.duration : 2000}
      onClose={handleClose}
      TransitionProps={{ onExited: handleExited }}
      anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
    >
      <Alert
        onClose={handleClose}
        severity={messageInfo?.severity}
        variant="filled"
      >
        {messageInfo ? messageInfo.message : undefined}
      </Alert>
    </Snackbar>
  );
};

export default Notification;
