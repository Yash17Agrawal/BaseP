import React, { JSX } from "react";
import { Theme, createStyles } from "@mui/material/styles";
import { Modal } from "react-bootstrap";
import "./genericModal.scss";

interface IProps {
  children: JSX.Element;
  title?: string;
  hideModal: () => void;
}

const GenericModal = (props: IProps) => {
  return (
    <Modal
      show={true}
      className="generic-modal"
      // backdrop="static"
      centered
      size="lg"
      onHide={() => {
        props.hideModal();
      }}
    >
      <Modal.Header closeButton>
        <Modal.Title>{props.title}</Modal.Title>
      </Modal.Header>
      <Modal.Body>{props.children}</Modal.Body>
    </Modal>
  );
};

export default GenericModal;
