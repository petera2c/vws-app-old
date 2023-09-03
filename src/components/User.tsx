import React, { useContext, useEffect, useState } from "react";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import { Button, Space } from "antd";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

import DisplayName from "./views/DisplayName";

import { UserContext } from "../context";

import { startConversation } from "./Vent/util";
import {
  educationList,
  kidsList,
  partyingList,
  politicalBeliefsList,
} from "../PersonalOptions";
import {
  calculateKarma,
  capitolizeFirstChar,
  getUserBasicInfo,
  userSignUpProgress,
} from "../util";
import UserBasicInfo from "@/types/UserBasicInfo";
import Link from "next/link";
import MakeAvatar from "./views/MakeAvatar";
import {
  faBaby,
  faComments,
  faGlassCheers,
  faLandmark,
  faPray,
  faSchool,
} from "@fortawesome/free-solid-svg-icons";
import { useRecoilState } from "recoil";
import { starterModalAtom } from "@/atoms/ModalVisibility";

dayjs.extend(relativeTime);

const UserComponent = ({
  additionalUserInfo,
  displayName,
  isUserOnline,
  lastOnline,
  showAdditionaluserInformation,
  showMessageUser,
  userID,
}: any) => {
  const { user } = useContext(UserContext);
  const [, setStarterModal] = useRecoilState(starterModalAtom);

  const [userInfo, setUserInfo] = useState<UserBasicInfo>();

  const [karmaPoints, setKarmaPoints] = useState(0);

  useEffect(() => {
    getUserBasicInfo((newUserInfo: UserBasicInfo) => {
      setUserInfo(newUserInfo);
      setKarmaPoints(calculateKarma(newUserInfo));
    }, userID);
  }, [userID]);

  return (
    <Link
      className="button-6 flex flex flex-col container twentyvw overflow-hidden bg-white br8 pa16"
      href={"/profile?" + userID}
    >
      <div className="flex flex-col w-full grow gap-2">
        <div className="w-full full-center">
          <MakeAvatar
            displayName={userInfo?.displayName}
            size="large"
            userBasicInfo={userInfo}
          />
        </div>

        <div className="grow justify-end flex flex-col gap-1">
          <div className="w-full items-center flex-wrap gap-2">
            <DisplayName
              big
              displayName={userInfo?.displayName}
              isLink={false}
              isUserOnline={isUserOnline}
              noAvatar
              userBasicInfo={userInfo}
            />
          </div>
          <p className="lh-1">{karmaPoints} Karma Points</p>
        </div>
        {(userInfo?.birth_date || userInfo?.gender || userInfo?.pronouns) && (
          <div className="gap-2">
            {Boolean(dayjs().year() - dayjs(userInfo?.birth_date).year()) && (
              <div className="flex flex-col">
                <h6 className="fw-400">Age</h6>
                <h6 className="grey-1 fw-400">
                  {dayjs().year() - dayjs(userInfo?.birth_date).year()}
                </h6>
              </div>
            )}

            {userInfo?.gender && (
              <div className="flex flex-col">
                <h6 className="fw-400">Gender</h6>
                <h6 className="grey-1 fw-400">{userInfo?.gender}</h6>
              </div>
            )}
            {userInfo?.pronouns && (
              <div className="flex flex-col">
                <h6 className="fw-400">Pronouns</h6>
                <h6 className="grey-1 fw-400">{userInfo?.pronouns}</h6>
              </div>
            )}
          </div>
        )}

        {showAdditionaluserInformation && (
          <div className="flex flex-wrap">
            {additionalUserInfo?.education !== undefined && (
              <div className="border-all items-center px8 py4 br4">
                <p>
                  <FontAwesomeIcon className="mr8" icon={faSchool} />
                  {educationList[additionalUserInfo?.education]}
                </p>
              </div>
            )}
            {additionalUserInfo?.kids !== undefined && (
              <div className="border-all items-center px8 py4 br4">
                <p>
                  <FontAwesomeIcon className="mr8" icon={faBaby} />
                  {kidsList[additionalUserInfo?.kids]}
                </p>
              </div>
            )}
            {additionalUserInfo?.partying !== undefined && (
              <div className="border-all items-center px8 py4 br4">
                <p>
                  <FontAwesomeIcon className="mr8" icon={faGlassCheers} />
                  {partyingList[additionalUserInfo?.partying]}
                </p>
              </div>
            )}
            {additionalUserInfo?.politics !== undefined && (
              <div className="border-all items-center px8 py4 br4">
                <p>
                  <FontAwesomeIcon className="mr8" icon={faLandmark} />
                  {politicalBeliefsList[additionalUserInfo?.politics]}
                </p>
              </div>
            )}
            {additionalUserInfo?.religion !== undefined && (
              <div className="border-all items-center px8 py4 br4">
                <p>
                  <FontAwesomeIcon className="mr8" icon={faPray} />
                  {additionalUserInfo?.religion}
                </p>
              </div>
            )}
          </div>
        )}

        {showMessageUser && (
          <div className="flex flex-col grow justify-end gap-2">
            {lastOnline && (
              <p className="w-full lh-1">
                Last Seen: {dayjs(lastOnline).fromNow()}
              </p>
            )}
            {(!user || (user && user.uid !== userID)) && (
              <Button
                className="w-full px16 py8 br8"
                onClick={(e) => {
                  e.preventDefault();

                  const userInteractionIssues = userSignUpProgress(user);

                  if (userInteractionIssues) {
                    if (userInteractionIssues === "NSI") setStarterModal(true);
                    return;
                  }

                  startConversation(user, userID);
                }}
                icon={<FontAwesomeIcon className="mr8" icon={faComments} />}
                type="primary"
              >
                Message
              </Button>
            )}
          </div>
        )}
      </div>
    </Link>
  );
};

export default UserComponent;
