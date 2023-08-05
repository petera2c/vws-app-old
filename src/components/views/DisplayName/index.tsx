import React, { useEffect, useState } from "react";

import Container from "../../containers/Container";
import KarmaBadge from "../../views/KarmaBadge";

import { capitolizeFirstChar } from "../../../util";
import Link from "next/link";
import MakeAvatar from "../MakeAvatar";

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
      <Container className="align-center flex-fill ov-hidden gap4">
        <Link
          className="flex clickable align-center ov-hidden gap4"
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
            <Container className="full-center flex-fill ov-hidden gap4">
              <h5 className="button-1 ellipsis fw-400 grey-11">
                {capitolizedDisplayName}
              </h5>
              {isUserOnline === "online" && <div className="online-dot" />}
            </Container>
          )}
        </Link>
        {userBasicInfo && (
          <KarmaBadge
            noOnClick={noBadgeOnClick}
            noTooltip={noTooltip}
            userBasicInfo={userBasicInfo}
          />
        )}
      </Container>
    );
  else
    return (
      <Container className="align-center flex-fill ov-hidden">
        <Container className="flex-fill align-center ov-hidden gap4">
          {!noAvatar && (
            <MakeAvatar
              displayName={userBasicInfo.displayName}
              userBasicInfo={userBasicInfo}
            />
          )}
          {userBasicInfo && (
            <Container className="full-center flex-fill ov-hidden gap4">
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
            </Container>
          )}
        </Container>
      </Container>
    );
}

export default DisplayName;
