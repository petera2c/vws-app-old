import React from "react";

import Container from "../../containers/Container/Container";

function ConfirmAlertModal({ close, message, submit, title }: any) {
  return (
    <Container className="modal-container full-center normal-cursor">
      <Container className="modal container medium column ov-auto bg-white br4">
        <Container className="x-fill justify-center bg-grey-10 py16">
          <h4 className="grey-11 tac">{title}</h4>
        </Container>
        <Container className="column x-fill pa16">
          <h5 className="tac bold mb16">{message}</h5>
        </Container>
        <Container className="full-center border-top pa16">
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
        </Container>
      </Container>
      <Container className="modal-background" onClick={close} />
    </Container>
  );
}

export default ConfirmAlertModal;
