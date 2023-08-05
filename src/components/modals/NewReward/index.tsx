import React, { useEffect, useState } from "react";
import { Space } from "antd";

import { faComet } from "@fortawesome/pro-duotone-svg-icons/faComet";
import { faMeteor } from "@fortawesome/pro-duotone-svg-icons/faMeteor";
import { faStarShooting } from "@fortawesome/pro-duotone-svg-icons/faStarShooting";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

import Container from "../../containers/Container/Container";
import { getIsMobileOrTablet } from "../../../util";

function NewRewardModal({ close, newReward }) {
  const [isMobileOrTablet, setIsMobileOrTablet] = useState<boolean>();
  const [canClose, setCanClose] = useState(false);

  useEffect(() => {
    setIsMobileOrTablet(getIsMobileOrTablet());

    setTimeout(() => setCanClose(true), 2000);
  }, []);

  return (
    <Container
      className="modal-container full-center"
      onClick={() => {
        if (canClose) close();
      }}
    >
      <Container
        className={
          "modal column align-center ov-auto bg-white pa32 br8 " +
          (isMobileOrTablet ? "mx8" : "container medium")
        }
      >
        <Space className="column x-fill" size="large">
          <Container className="column">
            <h1 className="blue tac">Congratulations!</h1>
            <h4 className="tac">{newReward.title}</h4>
            <p className="blue tac">+ {newReward.karma_gained} Karma Points</p>
          </Container>
          <Space>
            <FontAwesomeIcon className="blue" icon={faComet} size="5x" />
            <FontAwesomeIcon className="blue" icon={faMeteor} size="5x" />
            <FontAwesomeIcon className="blue" icon={faStarShooting} size="5x" />
          </Space>
        </Space>
      </Container>
      <Container className="modal-background" />
    </Container>
  );
}

export default NewRewardModal;
