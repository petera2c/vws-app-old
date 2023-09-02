import React, { useRef, useState } from "react";

function DeleteAccountModal({ close, submit }: { close: any; submit: any }) {
  const textInput = useRef(null);

  const [inputString, setInputString] = useState("");
  const [isDeleting, setIsDeleting] = useState(false);

  return (
    <div className="modal-container full-center normal-cursor">
      <div className="modal container large flex flex-col bg-white br4">
        <div className="w-full justify-center bg-grey-10 py16">
          <h4 className="grey-11 text-center">Permanently Delete Account</h4>
        </div>
        <div className="grow flex flex-col w-full overflow-auto gap-4 py16 px32">
          <p className="text-center">
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
        </div>
        {!isDeleting && (
          <div className="full-center border-top pa16">
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
          </div>
        )}
      </div>
      <div className="modal-background" onClick={close} />
    </div>
  );
}

export default DeleteAccountModal;
