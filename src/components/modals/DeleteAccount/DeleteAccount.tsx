import React, { useRef, useState } from "react";

import Container from "../../containers/Container/Container";

function DeleteAccountModal({ close, submit }: { close: any; submit: any }) {
  const textInput = useRef(null);

  const [inputString, setInputString] = useState("");
  const [isDeleting, setIsDeleting] = useState(false);

  return (
    <Container className="modal-container full-center normal-cursor">
      <Container className="modal container large column bg-white br4">
        <Container className="x-fill justify-center bg-grey-10 py16">
          <h4 className="grey-11 tac">Permanently Delete Account</h4>
        </Container>
        <Container className="flex-fill column x-fill ov-auto gap16 py16 px32">
          <p className="tac">
            {isDeleting
              ? "Loading..."
              : "This will permanently delete every single item we have related to your account. None of this information will be recoverable. Are you sure you want to proceed?"}
          </p>
          {!isDeleting && (
            <input
              className="br4 pa8"
              onChange={(e) => {
                setInputString(e.target.value);
              }}
              placeholder={`Type "delete permanently" to continue`}
              ref={textInput}
              value={inputString}
            />
          )}
        </Container>
        {!isDeleting && (
          <Container className="full-center border-top pa16">
            <button
              className="grey-1 border-all py8 px32 mx4 br4"
              onClick={() => close()}
            >
              Cancel
            </button>
            <button
              className={
                "py8 px32 mx4 br4 " +
                (inputString === "delete permanently" ? "button-2" : "grey-1")
              }
              onClick={() => {
                if (inputString === "delete permanently") {
                  setIsDeleting(true);
                  submit();
                } else {
                  // @ts-ignore
                  textInput?.current?.focus();
                }
              }}
            >
              Yes, Continue
            </button>
          </Container>
        )}
      </Container>
      <Container className="modal-background" onClick={close} />
    </Container>
  );
}

export default DeleteAccountModal;
