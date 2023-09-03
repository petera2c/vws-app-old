import React, { useEffect, useState } from "react";
import { Modal, Space } from "antd";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

import { getIsMobileOrTablet } from "../../../util";
import {
  faMeteor,
  faSailboat,
  faStar,
} from "@fortawesome/free-solid-svg-icons";

function NewRewardModal({ close, newReward }: { close: any; newReward: any }) {
  const [isMobileOrTablet, setIsMobileOrTablet] = useState<boolean>();
  const [canClose, setCanClose] = useState(false);

  useEffect(() => {
    setIsMobileOrTablet(getIsMobileOrTablet());

    setTimeout(() => setCanClose(true), 2000);
  }, []);

  return (
    <Modal
      onCancel={() => {
        if (canClose) close();
      }}
    >
      <div
        className={
          "modal flex flex-col items-center overflow-auto bg-white pa32 br8 " +
          (isMobileOrTablet ? "mx8" : "container medium")
        }
      >
        <Space className="flex flex-col w-full" size="large">
          <div className="flex flex-col">
            <h1 className="blue text-center">Congratulations!</h1>
            <h4 className="text-center">{newReward.title}</h4>
            <p className="blue text-center">
              + {newReward.karma_gained} Karma Points
            </p>
          </div>
          <Space>
            <FontAwesomeIcon className="blue" icon={faSailboat} size="5x" />
            <FontAwesomeIcon className="blue" icon={faMeteor} size="5x" />
            <FontAwesomeIcon className="blue" icon={faStar} size="5x" />
          </Space>
        </Space>
      </div>
    </Modal>
  );
}

export default NewRewardModal;
