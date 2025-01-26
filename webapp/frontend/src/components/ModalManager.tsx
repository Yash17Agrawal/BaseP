import * as React from "react";
import { connect } from "react-redux";
import { IModalState } from "reducers/modalReducer";
import { HIDE_MODAL } from "actions/ModalActions";
import ModalRegistry from "components/ModalRegistry";

interface IMapDispatchToComponentProps {
  hideModal: () => void;
}

interface IState {
  modalReducer: IModalState
}

interface IComponentProps extends IModalState, IMapDispatchToComponentProps { }

const mapStateToProps = (state: IState): IModalState => ({
  show: state.modalReducer.show,
  type: state.modalReducer.type,
  params: state.modalReducer.params,
  headers: state.modalReducer.headers
});

const mapDispatchToProps = (dispatch: any): IMapDispatchToComponentProps => ({
  hideModal: () => {
    dispatch(HIDE_MODAL());
  }
});

const ModalManager: React.FC<IComponentProps> = props => {
  const modalRegistry = ModalRegistry.getInstance();
  if (!props.params.hideModal) {
    props.params.hideModal = props.hideModal;
  }
  const ModalComponent = modalRegistry.getModal(
    props.type,
    props.params,
    props.headers
  );

  return props.show ? ModalComponent : null;
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(ModalManager);
