import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

import Container from "../../containers/Container";

import { getIsMobileOrTablet } from "../../../util";
import { login } from "./util";
import { faEye } from "@fortawesome/free-solid-svg-icons";

const LoginModal = ({ setActiveModal }: any) => {
  const { register, handleSubmit } = useForm();

  const [canSeePassword, setCanSeePassword] = useState(false);
  const [isMobileOrTablet, setIsMobileOrTablet] = useState<boolean>();

  useEffect(() => {
    setIsMobileOrTablet(getIsMobileOrTablet());
  }, [setIsMobileOrTablet]);

  return (
    <Container className="modal-container">
      <Container
        className={
          "modal column align-center ov-auto bg-white br4 " +
          (isMobileOrTablet ? "mx8" : "container medium")
        }
      >
        <Container className="x-fill justify-center bg-blue py16">
          <h4 className="tac white">Sign In</h4>
        </Container>
        <Container className="x-fill column">
          <form
            className="x-fill column"
            onSubmit={handleSubmit((formData) => {
              login(formData, setActiveModal);
            })}
          >
            <Container className="x-fill column px32 py16">
              <input
                className="py8 px16 mb8 br4"
                type="text"
                placeholder="Email Address"
                {...register("email", {
                  required: "Required",
                })}
              />
              <Container className="x-fill full-center">
                <input
                  className="flex-fill py8 px16 mb8 br4"
                  type={canSeePassword ? "" : "password"}
                  placeholder="Password"
                  {...register("password", {
                    required: "Required",
                  })}
                />
                <FontAwesomeIcon
                  className={"clickable ml8 " + (canSeePassword ? "blue" : "")}
                  icon={faEye}
                  onClick={() => setCanSeePassword(!canSeePassword)}
                />
              </Container>
              <p
                className="tac clickable mb8"
                onClick={(e) => {
                  e.preventDefault();
                  setActiveModal("forgotPassword");
                }}
              >
                Have you forgotten your password?{" "}
                <span className="underline blue">Password reset</span>
              </p>
            </Container>

            <Container className="column x-fill full-center border-top px32 py16">
              <button className="x-fill bg-blue white py8 br4" type="submit">
                Sign In
              </button>

              <p className="x-fill tac mt8">
                Don't have an account?&nbsp;{" "}
                <span
                  className="clickable blue"
                  onClick={(e) => {
                    e.preventDefault();
                    setActiveModal("signUp");
                  }}
                >
                  Create Account
                </span>
              </p>
            </Container>
          </form>
        </Container>
      </Container>
      <Container
        className="modal-background"
        onClick={(e: any) => {
          e.preventDefault();
          setActiveModal("");
        }}
      />
    </Container>
  );
};

export default LoginModal;
