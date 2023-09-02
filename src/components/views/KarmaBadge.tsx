import React, { useEffect, useState } from "react";
import { Tooltip } from "antd";

import UserBasicInfo from "@/types/UserBasicInfo";

import { faMedal, faRocket } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

/*{
    "displayName": "Noelle",
    "server_timestamp": 1643218764000,
    "karma": 2571,
    "avatar": {
        "mouthType": "Twinkle",
        "eyeType": "Wink",
        "skinColor": "Pale",
        "hairColor": "BrownDark",
        "clotheType": "CollarSweater",
        "topType": "LongHairStraightStrand",
        "eyebrowType": "Default",
        "accessoriesType": "Round"
    },
    "id": "kpJGYvVMx0YLEpX7OY0FbnkI3FE3"
}*/
interface Avatar {
  mouthType: string;
  eyeType: string;
  skinColor: string;
  hairColor: string;
  clotheType: string;
  topType: string;
  eyebrowType: string;
  accessoriesType: string;
}

interface User {
  avatar: Avatar;
  displayName: string;
  id: string;
  is_admin?: boolean;
  karma: number;
  server_timestamp: number;
}

const KarmaBadge = ({
  noOnClick,
  onClick,
  noTooltip,
  userBasicInfo,
}: {
  noOnClick?: boolean;
  onClick?: () => void;
  noTooltip?: boolean;
  userBasicInfo?: any;
}) => {
  const [karma, setKarma] = useState(0);
  const [isAdmin, setIsAdmin] = useState<boolean>(false);

  useEffect(() => {
    import("../../util").then((functions) => {
      setKarma(functions.calculateKarma(userBasicInfo));
    });
    setIsAdmin(
      typeof userBasicInfo === "object"
        ? Boolean(userBasicInfo.is_admin)
        : false
    );
  }, [userBasicInfo]);

  if (isAdmin)
    return (
      <Tooltip
        placement="bottom"
        title={noTooltip ? "" : karma + " Karma Points"}
      >
        <span>
          <div
            className="clickable"
            onClick={(e) => {
              if (noOnClick) return;
              e.stopPropagation();
              e.preventDefault();

              if (onClick) onClick();
              else {
                // navigate("/site-info");
              }
            }}
          >
            <h5 className="bg-blue white fw-400 px8 py4 br8">Moderator</h5>
          </div>
        </span>
      </Tooltip>
    );

  let badgeColor;
  let badgeIcon;
  if (karma >= 10000) {
    badgeColor = "#0062ff";
    badgeIcon = faRocket;
  } else if (karma >= 5000) {
    badgeColor = "#06ac4b";
    badgeIcon = faRocket;
  } else if (karma >= 2500) {
    badgeColor = "#FF101F";
    badgeIcon = faRocket;
  } else if (karma >= 1000) {
    badgeColor = "#ff5100";
    badgeIcon = faRocket;
  } else if (karma >= 500) {
    badgeColor = "#66a1ff";
    badgeIcon = faMedal;
  } else if (karma >= 250) {
    badgeColor = "#07c556";
    badgeIcon = faMedal;
  } else if (karma >= 100) {
    badgeColor = "#ff6670";
    badgeIcon = faMedal;
  } else if (karma >= 50) {
    badgeColor = "#ff9666";
    badgeIcon = faMedal;
  }

  if (badgeColor && badgeIcon)
    return (
      <Tooltip
        placement="bottom"
        title={noTooltip ? "" : karma + " Karma Points"}
      >
        <span>
          <div
            className="clickable"
            onClick={(e) => {
              if (noOnClick) return;
              e.stopPropagation();
              e.preventDefault();

              if (typeof onClick === "function") onClick();
              else {
                // navigate("/site-info");
              }
            }}
          >
            <FontAwesomeIcon icon={badgeIcon} color={badgeColor} size="2x" />
          </div>
        </span>
      </Tooltip>
    );
  else return <div></div>;
};

export default KarmaBadge;
