import * as React from "react";

import { ModalType } from "constants/modalTypes";
import Loader from "./Loader/Loader";
import GenericModal from "./Modals/Generic/GenericModal";
import { ApplyCouponModal } from "./Modals/ApplyCoupon/ApplyCouponModal";

class ModalRegistry {
  private static instance: ModalRegistry;
  private constructor() {
    // initial setup
  }
  public static getInstance(): ModalRegistry {
    if (!ModalRegistry.instance) {
      ModalRegistry.instance = new ModalRegistry();
    }
    return ModalRegistry.instance;
  }

  public getModal(
    type: ModalType,
    params: any,
    headers: any
  ): React.JSX.Element | null {
    switch (type) {
      case ModalType.LOADER:
        return <Loader />;
      case ModalType.GENERIC_MODAL:
        return <GenericModal {...params} />;
      case ModalType.APPLY_COUPON:
        return <ApplyCouponModal {...params} />;
      default:
        return null;
    }
  }
}

export default ModalRegistry;
