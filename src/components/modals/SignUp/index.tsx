import React, { useContext, useEffect, useState } from "react";
import { useForm } from "react-hook-form";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

import Container from "../../containers/Container";

import { UserContext } from "../../../context";
import { getIsMobileOrTablet } from "../../../util";
import { signUp } from "./util";
import { useRouter } from "next/router";

function SignUpModal({ setActiveModal }: any) {
  const router = useRouter();
  const { register, handleSubmit } = useForm();

  const { setUserBasicInfo } = useContext(UserContext);

  const [canSeePassword, setCanSeePassword] = useState(false);
  const [isMobileOrTablet, setIsMobileOrTablet] = useState<boolean>();

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
          <h4 className="tac white">Create an Account</h4>
        </Container>

        <Container className="x-fill column">
          <form
            className="x-fill column"
            onSubmit={handleSubmit((data) => {
              signUp(data, navigate, setActiveModal, setUserBasicInfo);
            })}
          >
            <Container className="x-fill column px32 py16">
              <input
                className="py8 px16 mb8 br4"
                type="text"
                name="displayName"
                placeholder="Display Name"
                {...register("displayName", {
                  required: "Required",
                })}
              />
              <input
                className="py8 px16 br4"
                name="email"
                type="text"
                placeholder="Email Address"
                {...register("email", {
                  required: "Required",
                })}
              />
              <p className="fw-400 mb8">
                (Your email address will never be shown to anyone.)
              </p>
              <Container className="x-fill wrap">
                <Container
                  className={
                    "column " + (isMobileOrTablet ? "x-100" : "x-50 pr8")
                  }
                >
                  <input
                    className="py8 px16 mb8 br4"
                    name="password"
                    type={canSeePassword ? "" : "password"}
                    placeholder="Password"
                    {...register("password", {
                      required: "Required",
                    })}
                  />
                </Container>
                <Container
                  className={
                    "column " + (isMobileOrTablet ? "x-100" : "x-50 pl8")
                  }
                >
                  <Container className="x-fill full-center">
                    <input
                      className="py8 px16 mb8 br4"
                      name="passwordConfirm"
                      type={canSeePassword ? "" : "password"}
                      placeholder="Confirm Password"
                      {...register("passwordConfirm", {
                        required: "Required",
                      })}
                    />
                    <FontAwesomeIcon
                      className={
                        "clickable ml8 " + (canSeePassword ? "blue" : "")
                      }
                      icon={faEye}
                      onClick={() => setCanSeePassword(!canSeePassword)}
                    />
                  </Container>
                </Container>
              </Container>
            </Container>
            <Container className="column x-fill full-center border-top px32 py16">
              <button className="x-fill bg-blue white py8 br4" type="submit">
                Create Account
              </button>

              <p className="x-fill tac mt8">
                Already have an account?&nbsp;
                <span
                  className="clickable blue"
                  onClick={(e) => {
                    e.preventDefault();
                    setActiveModal("login");
                  }}
                >
                  Login
                </span>
              </p>
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

export default SignUpModal;
