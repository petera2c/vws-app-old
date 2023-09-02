import React, { useEffect, useState } from "react";

import KarmaBadge from "./KarmaBadge";

import { capitolizeFirstChar } from "../../util";
import Link from "next/link";
import MakeAvatar from "./MakeAvatar";

function DisplayName({
  big,
  displayName,
  isLink = true,
  isUserOnline,
  noAvatar,
  noBadgeOnClick,
  noTooltip,
  userBasicInfo,
  userID,
}: any) {
  const [capitolizedDisplayName, setCapitolizedDisplayName] =
    useState("Anonymous");

  useEffect(() => {
    setCapitolizedDisplayName(capitolizeFirstChar(displayName));
  }, [displayName]);

  if (isLink)
    return (
      <div className="items-center grow overflow-hidden gap4">
        <Link
          className="flex clickable items-center overflow-hidden gap4"
          onClick={(e) => {
            e.stopPropagation();
          }}
          href={"/profile?" + userID}
        >
          <MakeAvatar
            displayName={userBasicInfo.displayName}
            userBasicInfo={userBasicInfo}
          />
          {userBasicInfo && (
            <div className="full-center grow overflow-hidden gap4">
              <h5 className="button-1 ellipsis fw-400 grey-11">
                {capitolizedDisplayName}
              </h5>
              {isUserOnline === "online" && <div className="online-dot" />}
            </div>
          )}
        </Link>
        {userBasicInfo && (
          <KarmaBadge
            noOnClick={noBadgeOnClick}
            noTooltip={noTooltip}
            userBasicInfo={userBasicInfo}
          />
        )}
      </div>
    );
  else
    return (
      <div className="items-center grow overflow-hidden">
        <div className="grow items-center overflow-hidden gap4">
          {!noAvatar && (
            <MakeAvatar
              displayName={userBasicInfo.displayName}
              userBasicInfo={userBasicInfo}
            />
          )}
          {userBasicInfo && (
            <div className="full-center grow overflow-hidden gap4">
              <h5
                className={
                  "ellipsis fw-400 " + (big ? "fs-24 primary" : "grey-11")
                }
              >
                {capitolizedDisplayName}
              </h5>
              {isUserOnline && <div className="online-dot" />}
              {userBasicInfo && (
                <KarmaBadge
                  noOnClick={noBadgeOnClick}
                  noTooltip={noTooltip}
                  userBasicInfo={userBasicInfo}
                />
              )}
            </div>
          )}
        </div>
      </div>
    );
}

export default DisplayName;
