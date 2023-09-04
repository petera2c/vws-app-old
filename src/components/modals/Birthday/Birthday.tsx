import React, { useEffect, useState } from "react";
import { Button, Modal, Space } from "antd";

import { faBirthdayCake } from "@fortawesome/free-solid-svg-icons/faBirthdayCake";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

import { getIsMobileOrTablet } from "../../../util";
import Link from "next/link";

function BirthdayModal({ close }: any) {
  const [canClose, setCanClose] = useState(false);
  const [isMobileOrTablet, setIsMobileOrTablet] = useState(false);

  useEffect(() => {
    setIsMobileOrTablet(getIsMobileOrTablet());

    setTimeout(() => {
      setCanClose(true);
    }, 2000);
  }, []);

  return (
    <Modal
      onCancel={() => {
        if (canClose) close();
      }}
    >
      <div
        className={
          "flex flex-col items-center overflow-auto bg-white pa32 br8 " +
          (isMobileOrTablet ? "mx8" : "container medium")
        }
      >
        <Space className="flex flex-col w-full" size="large">
          <div className="flex flex-col">
            <h1 className="blue text-center">Happy Birthday!</h1>
            <h4 className="text-center">
              We are so happy to celebrate this special day with you!
            </h4>
          </div>
          <Link href="/birthday-post">
            <Button onClick={close} size="large" type="primary">
              Create Birthday Post
            </Button>
          </Link>
          <Space>
            <FontAwesomeIcon className="blue" icon={faBirthdayCake} size="5x" />
            <FontAwesomeIcon
              className="purple"
              icon={faBirthdayCake}
              size="5x"
            />
            <FontAwesomeIcon
              className="orange"
              icon={faBirthdayCake}
              size="5x"
            />
            <FontAwesomeIcon className="red" icon={faBirthdayCake} size="5x" />
            <FontAwesomeIcon
              className="green"
              icon={faBirthdayCake}
              size="5x"
            />
          </Space>
        </Space>
      </div>
    </Modal>
  );
}

export default BirthdayModal;
