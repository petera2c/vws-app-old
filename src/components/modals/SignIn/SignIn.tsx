import React, { useState } from "react";
import { useForm } from "react-hook-form";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

import { login } from "./util";
import { faEye } from "@fortawesome/free-solid-svg-icons";
import { Button, Input, Modal } from "antd";
import { useRecoilState } from "recoil";
import { starterModalAtom } from "@/atoms/ModalVisibility";

const LoginModal = () => {
  const { register, handleSubmit } = useForm();
  const [starterModal, setStarterModal] = useRecoilState(starterModalAtom);

  const [canSeePassword, setCanSeePassword] = useState(false);

  return (
    <Modal
      footer={null}
      onCancel={() => setStarterModal("")}
      open={starterModal === "sign-in" || starterModal === true}
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
            <div className="flex flex-col w-full gap-2 px32 py16">
              <Input
                type="text"
                placeholder="Email Address"
                {...register("email", {
                  required: "Required",
                })}
              />
              <div className="flex full-center w-full">
                <Input
                  className="grow"
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
                  setStarterModal("forgot-password");
                }}
              >
                Have you forgotten your password?{" "}
                <span className="underline blue">Password reset</span>
              </p>
            </div>

            <div className="flex flex-col w-full full-center border-top px32 py16">
              <Button className="w-full" size="large" type="primary">
                Sign In
              </Button>

              <p className="w-full text-center mt8">
                Don't have an account?&nbsp;{" "}
                <span
                  className="cursor-pointer blue"
                  onClick={(e) => {
                    e.preventDefault();
                    setStarterModal("sign-up");
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
