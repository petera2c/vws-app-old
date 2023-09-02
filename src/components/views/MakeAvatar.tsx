import React, { useEffect, useMemo, useState } from "react";

import UserBasicInfo from "@/types/UserBasicInfo";
import { capitolizeFirstChar } from "../../util";
import ReactNiceAvatar, { genConfig } from "react-nice-avatar";

function MakeAvatar({
  className,
  displayName,
  size,
  userBasicInfo,
}: {
  className?: string;
  displayName?: string;
  size?: string;
  userBasicInfo?: UserBasicInfo;
}) {
  const [capitolizedDisplayName, setCapitolizedDisplayName] = useState("");

  useEffect(() => {
    setCapitolizedDisplayName(
      capitolizeFirstChar(displayName ? displayName : "Anonymous")[0]
    );
  }, [displayName]);

  const config = {
    sex: "woman",
    faceColor: "#F9C9B6",
    earSize: "big",
    eyeStyle: "circle",
    noseStyle: "long",
    mouthStyle: "laugh",
    shirtStyle: "hoody",
    glassesStyle: "none",
    hairColor: "#506AF4",
    hairStyle: "womanShort",
    hatStyle: "none",
    hatColor: "#77311D",
    eyeBrowStyle: "upWoman",
    shirtColor: "#9287FF",
    bgColor: "#F48150",
  };
  // @ts-ignore
  const myConfig = genConfig(config);

  if (userBasicInfo && userBasicInfo.avatar) {
    if (size === "large")
      return (
        <div className={"avatar large " + className}>
          <ReactNiceAvatar
            style={{ minWidth: "3rem", minHeight: "3rem", height: "3rem" }}
            {...myConfig}
          />
        </div>
      );
    else if (size === "small")
      return (
        <div className={"avatar small " + className}>
          <ReactNiceAvatar
            style={{ minWidth: "3rem", minHeight: "3rem", height: "3rem" }}
            {...myConfig}
          />
        </div>
      );
    else
      return (
        <div className={"avatar " + className}>
          <ReactNiceAvatar
            style={{ minWidth: "3rem", minHeight: "3rem", height: "3rem" }}
            {...myConfig}
          />
        </div>
      );
  } else {
    if (size === "large")
      return (
        <p
          className={"avatar semi-large bold bg-blue white " + className}
          style={{ fontSize: "48px" }}
        >
          {capitolizedDisplayName}
        </p>
      );
    else if (size === "small")
      return (
        <p
          className={"avatar very-small fs-20 bold bg-blue white " + className}
        >
          {capitolizedDisplayName}
        </p>
      );
    else
      return (
        <p className={"avatar small fs-20 bold bg-blue white " + className}>
          {capitolizedDisplayName}
        </p>
      );
  }
}

export default MakeAvatar;
