import { Modal } from "antd";
import React from "react";

function ConfirmAlertModal({ close, message, submit, title }: any) {
  return (
    <Modal className="full-center normal-cursor" onCancel={close}>
      <div className="container medium flex flex-col overflow-auto bg-white br4">
        <div className="w-full justify-center bg-grey-10 py16">
          <h4 className="grey-11 text-center">{title}</h4>
        </div>
        <div className="flex flex-col w-full pa16">
          <h5 className="text-center bold mb16">{message}</h5>
        </div>
        <div className="full-center border-top pa16">
          <button
            className="grey-1 border-all py8 px32 mx4 br4"
            onClick={() => close()}
          >
            Cancel
          </button>
          <button
            className="button-2 py8 px32 mx4 br4"
            onClick={() => {
              submit();
              close();
            }}
          >
            Submit
          </button>
        </div>
      </div>
    </Modal>
  );
}

export default ConfirmAlertModal;
