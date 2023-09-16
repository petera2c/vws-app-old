import React, { useState } from "react";
import { useForm } from "react-hook-form";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

import { login } from "./util";
import { faEye } from "@fortawesome/free-solid-svg-icons";
import { Button, Form, Input, Modal } from "antd";
import { useRecoilState } from "recoil";
import { starterModalAtom } from "@/atoms/ModalVisibility";

const LoginModal = () => {
  const [starterModal, setStarterModal] = useRecoilState(starterModalAtom);

  const [canSeePassword, setCanSeePassword] = useState(false);

  return (
    <Modal
      footer={null}
      onCancel={() => setStarterModal("")}
      open={starterModal === "sign-in" || starterModal === true}
    >
      <div className="flex flex-col">
        <div className="w-full justify-center bg-blue py-4">
          <h4 className="text-center white">Sign In</h4>
        </div>
        <div className="w-full flex flex-col">
          <Form
            className="w-full flex flex-col"
            onFinish={(values: any) => {
              console.log(values);
              //login(values, setStarterModal);
            }}
          >
            <div className="flex flex-col w-full px-8 py-4">
              <Form.Item name="email">
                <Input
                  className="mb-4"
                  placeholder="Email Address"
                  type="text"
                />
              </Form.Item>
              <div className="flex full-center w-full mb-1">
                <Form.Item
                  className="grow"
                  name="password"
                  rules={[
                    { required: true, message: "Please input your email!" },
                  ]}
                >
                  <Input
                    className="grow"
                    placeholder="Password"
                    type={canSeePassword ? "" : "password"}
                  />
                </Form.Item>
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

            <div className="flex flex-col w-full full-center border-top gap-2 px-8 py-4">
              <Button
                className="w-full"
                htmlType="submit"
                size="large"
                type="primary"
              >
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
          </Form>
        </div>
      </div>
    </Modal>
  );
};

export default LoginModal;
