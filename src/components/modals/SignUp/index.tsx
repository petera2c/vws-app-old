import React, { useContext, useEffect, useState } from "react";
import { useForm } from "react-hook-form";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

import { UserContext } from "../../../context";
import { getIsMobileOrTablet } from "../../../util";
import { signUp } from "./util";
import { faEye } from "@fortawesome/free-solid-svg-icons";
import { Input, Modal } from "antd";
import { useRecoilState } from "recoil";
import { starterModalAtom } from "@/atoms/ModalVisibility";
import { useRouter } from "next/navigation";

const SignUpModal = () => {
  const router = useRouter();
  const { register, handleSubmit } = useForm();

  const { setUserBasicInfo } = useContext(UserContext);
  const [, setStarterModal] = useRecoilState(starterModalAtom);

  const [canSeePassword, setCanSeePassword] = useState(false);
  const [isMobileOrTablet, setIsMobileOrTablet] = useState<boolean>();

  useEffect(() => {
    setIsMobileOrTablet(getIsMobileOrTablet());
  }, [setIsMobileOrTablet]);

  return (
    <Modal className="full-center">
      <div
        className={
          "flex flex-col items-center overflow-auto bg-white br4 " +
          (isMobileOrTablet ? "mx8" : "container medium")
        }
      >
        <div className="w-full justify-center bg-blue py16">
          <h4 className="text-center white">Create an Account</h4>
        </div>

        <div className="w-full flex flex-col">
          <form
            className="w-full flex flex-col"
            onSubmit={handleSubmit((data) => {
              signUp(data, router, setStarterModal, setUserBasicInfo);
            })}
          >
            <div className="w-full flex flex-col px32 py16">
              <Input
                className="mb8"
                type="text"
                placeholder="Display Name"
                {...register("displayName", {
                  required: "Required",
                })}
              />
              <Input
                type="text"
                placeholder="Email Address"
                {...register("email", {
                  required: "Required",
                })}
              />
              <p className="fw-400 mb8">
                (Your email address will never be shown to anyone.)
              </p>
              <div className="w-full flex-wrap">
                <div
                  className={
                    "flex flex-col " + (isMobileOrTablet ? "x-100" : "x-50 pr8")
                  }
                >
                  <Input
                    className="mb8"
                    type={canSeePassword ? "" : "password"}
                    placeholder="Password"
                    {...register("password", {
                      required: "Required",
                    })}
                  />
                </div>
                <div
                  className={
                    "flex flex-col " + (isMobileOrTablet ? "x-100" : "x-50 pl8")
                  }
                >
                  <div className="flex full-center w-full">
                    <Input
                      className="mb8"
                      type={canSeePassword ? "" : "password"}
                      placeholder="Confirm Password"
                      {...register("passwordConfirm", {
                        required: "Required",
                      })}
                    />
                    <FontAwesomeIcon
                      className={
                        "cursor-pointer ml8 " + (canSeePassword ? "blue" : "")
                      }
                      icon={faEye}
                      onClick={() => setCanSeePassword(!canSeePassword)}
                    />
                  </div>
                </div>
              </div>
            </div>
            <div className="flex flex-col w-full full-center border-top px32 py16">
              <button className="w-full bg-blue white py8 br4" type="submit">
                Create Account
              </button>

              <p className="w-full text-center mt8">
                Already have an account?&nbsp;
                <span
                  className="cursor-pointer blue"
                  onClick={(e) => {
                    e.preventDefault();
                    setStarterModal("login");
                  }}
                >
                  Login
                </span>
              </p>
            </div>
          </form>
        </div>
      </div>
      <div
        className="modal-background"
        onClick={(e) => {
          e.preventDefault();
          setStarterModal("");
        }}
      />
    </Modal>
  );
};

export default SignUpModal;
