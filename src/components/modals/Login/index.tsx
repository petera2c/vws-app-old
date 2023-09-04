import React, { useState } from "react";
import { useForm } from "react-hook-form";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

import { login } from "./util";
import { faEye } from "@fortawesome/free-solid-svg-icons";
import { Input, Modal } from "antd";
import { useRecoilState } from "recoil";
import { starterModalAtom } from "@/atoms/ModalVisibility";

const LoginModal = () => {
  const { register, handleSubmit } = useForm();
  const [startedModal, setStarterModal] = useRecoilState(starterModalAtom);

  const [canSeePassword, setCanSeePassword] = useState(false);

  return (
    <Modal
      onCancel={() => setStarterModal("")}
      open={startedModal === "login" || startedModal === true}
    >
      <div className="flex flex-col">
        <div className="w-full justify-center bg-blue py16">
          <h4 className="text-center white">Sign In</h4>
        </div>
        <div className="w-full flex flex-col">
          <form
            className="w-full flex flex-col"
            onSubmit={handleSubmit((formData) => {
              login(formData, setStarterModal);
            })}
          >
            <div className="w-full flex flex-col px32 py16">
              <Input
                className="py8 px16 mb8 br4"
                type="text"
                placeholder="Email Address"
                {...register("email", {
                  required: "Required",
                })}
              />
              <div className="flex full-center w-full">
                <Input
                  className="grow py8 px16 mb8 br4"
                  type={canSeePassword ? "" : "password"}
                  placeholder="Password"
                  {...register("password", {
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
              <p
                className="text-center cursor-pointer mb8"
                onClick={(e) => {
                  e.preventDefault();
                  setStarterModal("forgotPassword");
                }}
              >
                Have you forgotten your password?{" "}
                <span className="underline blue">Password reset</span>
              </p>
            </div>

            <div className="flex flex-col w-full full-center border-top px32 py16">
              <button className="w-full bg-blue white py8 br4" type="submit">
                Sign In
              </button>

              <p className="w-full text-center mt8">
                Don't have an account?&nbsp;{" "}
                <span
                  className="cursor-pointer blue"
                  onClick={(e) => {
                    e.preventDefault();
                    setStarterModal("signUp");
                  }}
                >
                  Create Account
                </span>
              </p>
            </div>
          </form>
        </div>
      </div>
    </Modal>
  );
};

export default LoginModal;
