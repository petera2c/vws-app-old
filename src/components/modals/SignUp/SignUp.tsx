import React, { useContext, useEffect, useState } from "react";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

import { UserContext } from "../../../context";
import { useIsMobileOrTablet } from "../../../util";
import { signUp } from "./util";
import { faEye } from "@fortawesome/free-solid-svg-icons";
import { Button, Form, Input, Modal } from "antd";
import { useRecoilState } from "recoil";
import { starterModalAtom } from "@/atoms/ModalVisibility";
import { useRouter } from "next/navigation";

const SignUpModal = () => {
  const isMobileOrTablet = useIsMobileOrTablet();
  const router = useRouter();

  const { setUserBasicInfo } = useContext(UserContext);
  const [starterModal, setStarterModal] = useRecoilState(starterModalAtom);

  const [canSeePassword, setCanSeePassword] = useState(false);

  return (
    <Modal
      className="full-center"
      footer={null}
      onCancel={() => setStarterModal("")}
      open={starterModal === "sign-up"}
    >
      <div className={"flex flex-col "}>
        <div className="w-full justify-center bg-blue py-4">
          <h4 className="text-center white">Create an Account</h4>
        </div>

        <div className="w-full flex flex-col">
          <Form
            className="w-full flex flex-col"
            onFinish={(data: any) => {
              console.log(data);
              signUp(data, router, setStarterModal, setUserBasicInfo);
            }}
          >
            <div className="flex flex-col w-full gap-2 px-8 py-4">
              <Form.Item name="displayName" required>
                <Input className="mb8" type="text" placeholder="Display Name" />
              </Form.Item>
              <Form.Item name="email">
                <Input type="text" placeholder="Email Address" />
              </Form.Item>
              <p className="fw-400 mb8">
                (Your email address will never be shown to anyone.)
              </p>
              <div className="flex w-full flex-wrap">
                <div
                  className={
                    "flex flex-col " +
                    (isMobileOrTablet ? "x-100" : "x-50 pr-2")
                  }
                >
                  <Form.Item name="password" required>
                    <Input
                      className="mb8"
                      type={canSeePassword ? "" : "password"}
                      placeholder="Password"
                    />
                  </Form.Item>
                </div>
                <div
                  className={
                    "flex flex-col " +
                    (isMobileOrTablet ? "x-100" : "x-50 pl-2")
                  }
                >
                  <div className="flex full-center w-full">
                    <Form.Item name="passwordConfirm" required>
                      <Input
                        className="mb8"
                        type={canSeePassword ? "" : "password"}
                        placeholder="Confirm Password"
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
                </div>
              </div>
            </div>
            <div className="flex flex-col w-full full-center border-top px-8 py-4">
              <Button className="w-full" size="large" type="primary">
                Create Account
              </Button>

              <p className="w-full text-center mt8">
                Already have an account?&nbsp;
                <span
                  className="cursor-pointer blue"
                  onClick={(e) => {
                    e.preventDefault();
                    setStarterModal("sign-in");
                  }}
                >
                  Login
                </span>
              </p>
            </div>
          </Form>
        </div>
      </div>
    </Modal>
  );
};

export default SignUpModal;
