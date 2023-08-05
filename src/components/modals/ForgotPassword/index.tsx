import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";

import Container from "../../containers/Container";

import { getIsMobileOrTablet } from "../../../util";

import { sendPasswordReset } from "./util";

function ForgotPasswordModal({ setActiveModal }) {
  const { register, handleSubmit } = useForm();

  const [isMobileOrTablet, setIsMobileOrTablet] = useState();

  useEffect(() => {
    setIsMobileOrTablet(getIsMobileOrTablet());
  }, [setIsMobileOrTablet]);

  return (
    <Container className="modal-container full-center">
      <Container
        className={
          "modal column align-center ov-auto bg-white br4 " +
          (isMobileOrTablet ? "mx8" : "container medium")
        }
      >
        <Container className="x-fill justify-center bg-blue py16">
          <h4 className="tac white">Password Reset</h4>
        </Container>

        <Container className="x-fill column">
          <Container className="x-fill full-center px32">
            <p className="x-fill tac border-bottom py16">
              Already have an account?&nbsp;
              <span
                className="clickable blue"
                onClick={() => setActiveModal("login")}
              >
                Login
              </span>
            </p>
          </Container>

          <form
            className="x-fill column"
            onSubmit={handleSubmit((data) => {
              sendPasswordReset(data);
            })}
          >
            <Container className="x-fill column px32 py16">
              <input
                className="py8 px16 mb8 br4"
                type="text"
                name="email"
                placeholder="Email Address"
                {...register("email", {
                  required: "Required",
                })}
              />
            </Container>
            <Container className="x-fill full-center border-top px32 py16">
              <button className="x-fill bg-blue white py8 br4" type="submit">
                Send Email Password Reset Link
              </button>
            </Container>
          </form>
        </Container>
      </Container>
      <Container
        className="modal-background"
        onClick={(e) => {
          e.preventDefault();
          setActiveModal("");
        }}
      />
    </Container>
  );
}

export default ForgotPasswordModal;
