import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";

import { getIsMobileOrTablet } from "../../../util";

import { sendPasswordReset } from "./util";
import { Button, Input, Modal } from "antd";
import { useRecoilState } from "recoil";
import { starterModalAtom } from "@/atoms/ModalVisibility";

const ForgotPasswordModal = () => {
  const { register, handleSubmit } = useForm();

  const [startedModal, setStarterModal] = useRecoilState(starterModalAtom);

  const [isMobileOrTablet, setIsMobileOrTablet] = useState<any>();

  useEffect(() => {
    setIsMobileOrTablet(getIsMobileOrTablet());
  }, [setIsMobileOrTablet]);

  return (
    <Modal
      footer={null}
      onCancel={() => setStarterModal("")}
      open={startedModal === "forgot-password"}
    >
      <div
        className={
          "flex flex-col items-center overflow-auto bg-white br4 " +
          (isMobileOrTablet ? "mx8" : "container medium")
        }
      >
        <div className="w-full justify-center bg-blue py-4">
          <h4 className="text-center white">Password Reset</h4>
        </div>

        <div className="w-full flex flex-col">
          <div className="flex full-center w-full px-8">
            <p className="w-full text-center border-bottom py-4">
              Already have an account?&nbsp;
              <span
                className="cursor-pointer blue"
                onClick={() => setStarterModal("sign-in")}
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
            <div className="flex flex-col w-full gap-2 px-8 py-4">
              <Input
                className="mb8"
                type="text"
                placeholder="Email Address"
                {...register("email", {
                  required: "Required",
                })}
              />
            </div>
            <div className="flex full-center w-full border-top px-8 py-4">
              <Button className="w-full" size="large" type="primary">
                Send Email Password Reset Link
              </Button>
            </div>
          </form>
        </div>
      </div>
    </Modal>
  );
};

export default ForgotPasswordModal;
