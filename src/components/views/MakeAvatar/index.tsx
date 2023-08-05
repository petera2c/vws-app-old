import React, { useEffect, useState } from "react";

import { capitolizeFirstChar } from "../../../util";
import { Avatar } from "antd";
import UserBasicInfo from "@/types/UserBasicInfo";

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

  if (userBasicInfo && userBasicInfo.avatar) {
    if (size === "large")
      return (
        <div className={"avatar large " + className}>
          <Avatar
            // @ts-ignore
            avatarStyle="Circle"
            topType={userBasicInfo.avatar.topType}
            accessoriesType={userBasicInfo.avatar.accessoriesType}
            hairColor={userBasicInfo.avatar.hairColor}
            facialHairType={userBasicInfo.avatar.facialHairType}
            clotheType={userBasicInfo.avatar.clotheType}
            eyeType={userBasicInfo.avatar.eyeType}
            eyebrowType={userBasicInfo.avatar.eyebrowType}
            mouthType={userBasicInfo.avatar.mouthType}
            skinColor={userBasicInfo.avatar.skinColor}
            style={{ height: "100%" }}
          />
        </div>
      );
    else if (size === "small")
      return (
        <div className={"avatar small " + className}>
          <Avatar
            // @ts-ignore
            avatarStyle="Circle"
            topType={userBasicInfo.avatar.topType}
            accessoriesType={userBasicInfo.avatar.accessoriesType}
            hairColor={userBasicInfo.avatar.hairColor}
            facialHairType={userBasicInfo.avatar.facialHairType}
            clotheType={userBasicInfo.avatar.clotheType}
            eyeType={userBasicInfo.avatar.eyeType}
            eyebrowType={userBasicInfo.avatar.eyebrowType}
            mouthType={userBasicInfo.avatar.mouthType}
            skinColor={userBasicInfo.avatar.skinColor}
            style={{ height: "100%" }}
          />
        </div>
      );
    else
      return (
        <div className={"avatar " + className}>
          <Avatar
            // @ts-ignore
            avatarStyle="Circle"
            topType={userBasicInfo.avatar.topType}
            accessoriesType={userBasicInfo.avatar.accessoriesType}
            hairColor={userBasicInfo.avatar.hairColor}
            facialHairType={userBasicInfo.avatar.facialHairType}
            clotheType={userBasicInfo.avatar.clotheType}
            eyeType={userBasicInfo.avatar.eyeType}
            eyebrowType={userBasicInfo.avatar.eyebrowType}
            mouthType={userBasicInfo.avatar.mouthType}
            skinColor={userBasicInfo.avatar.skinColor}
            style={{ height: "100%" }}
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
