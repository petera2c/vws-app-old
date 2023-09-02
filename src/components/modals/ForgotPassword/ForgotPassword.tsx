import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";

import { getIsMobileOrTablet } from "../../../util";

import { sendPasswordReset } from "./util";

function ForgotPasswordModal({ setActiveModal }: { setActiveModal: any }) {
  const { register, handleSubmit } = useForm();

  const [isMobileOrTablet, setIsMobileOrTablet] = useState<any>();

  useEffect(() => {
    setIsMobileOrTablet(getIsMobileOrTablet());
  }, [setIsMobileOrTablet]);

  return (
    <div className="modal-container full-center">
      <div
        className={
          "modal flex flex-col items-center overflow-auto bg-white br4 " +
          (isMobileOrTablet ? "mx8" : "container medium")
        }
      >
        <div className="w-full justify-center bg-blue py16">
          <h4 className="text-center white">Password Reset</h4>
        </div>

        <div className="w-full flex flex-col">
          <div className="w-full full-center px32">
            <p className="w-full text-center border-bottom py16">
              Already have an account?&nbsp;
              <span
                className="clickable blue"
                onClick={() => setActiveModal("login")}
              >
                Login
              </span>
            </p>
          </div>

          <form
            className="w-full column"
            onSubmit={handleSubmit((data: any) => {
              sendPasswordReset(data);
            })}
          >
            <div className="w-full flex flex-col px32 py16">
              <input
                className="py8 px16 mb8 br4"
                type="text"
                placeholder="Email Address"
                {...register("email", {
                  required: "Required",
                })}
              />
            </div>
            <div className="w-full full-center border-top px32 py16">
              <button className="w-full bg-blue white py8 br4" type="submit">
                Send Email Password Reset Link
              </button>
            </div>
          </form>
        </div>
      </div>
      <div
        className="modal-background"
        onClick={(e: any) => {
          e.preventDefault();
          setActiveModal("");
        }}
      />
    </div>
  );
}

export default ForgotPasswordModal;
