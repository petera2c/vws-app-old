import React, { useContext, useEffect, useState } from "react";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import { Space } from "antd";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

import Container from "./containers/Container/Container";
import DisplayName from "./views/DisplayName";
import StarterModal from "./modals/Starter";

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

  const [userInfo, setUserInfo] = useState<UserBasicInfo>();
  const [starterModal, setStarterModal] = useState(false);

  const [karmaPoints, setKarmaPoints] = useState(0);

  useEffect(() => {
    getUserBasicInfo((newUserInfo: UserBasicInfo) => {
      setUserInfo(newUserInfo);
      setKarmaPoints(calculateKarma(newUserInfo));
    }, userID);
  }, [userID]);

  return (
    <Link
      className="button-6 flex column container twentyvw ov-hidden bg-white br8 pa16"
      href={"/profile?" + userID}
    >
      <Container className="column x-fill flex-fill gap8">
        <Container className="x-fill full-center">
          <MakeAvatar
            displayName={userInfo?.displayName}
            size="large"
            userBasicInfo={userInfo}
          />
        </Container>

        <Container className="flex-fill justify-end column gap4">
          <Container className="x-fill align-center wrap gap8">
            <DisplayName
              big
              displayName={userInfo?.displayName}
              isLink={false}
              isUserOnline={isUserOnline}
              noAvatar
              userBasicInfo={userInfo}
            />
          </Container>
          <p className="lh-1">{karmaPoints} Karma Points</p>
        </Container>
        {(userInfo?.birth_date || userInfo?.gender || userInfo?.pronouns) && (
          <Container className="gap8">
            {Boolean(dayjs().year() - dayjs(userInfo?.birth_date).year()) && (
              <Container className="column">
                <h6 className="fw-400">Age</h6>
                <h6 className="grey-1 fw-400">
                  {dayjs().year() - dayjs(userInfo?.birth_date).year()}
                </h6>
              </Container>
            )}

            {userInfo?.gender && (
              <Container className="column">
                <h6 className="fw-400">Gender</h6>
                <h6 className="grey-1 fw-400">{userInfo?.gender}</h6>
              </Container>
            )}
            {userInfo?.pronouns && (
              <Container className="column">
                <h6 className="fw-400">Pronouns</h6>
                <h6 className="grey-1 fw-400">{userInfo?.pronouns}</h6>
              </Container>
            )}
          </Container>
        )}

        {showAdditionaluserInformation && (
          <Space wrap>
            {additionalUserInfo?.education !== undefined && (
              <Container className="border-all align-center px8 py4 br4">
                <p>
                  <FontAwesomeIcon className="mr8" icon={faSchool} />
                  {educationList[additionalUserInfo?.education]}
                </p>
              </Container>
            )}
            {additionalUserInfo?.kids !== undefined && (
              <Container className="border-all align-center px8 py4 br4">
                <p>
                  <FontAwesomeIcon className="mr8" icon={faBaby} />
                  {kidsList[additionalUserInfo?.kids]}
                </p>
              </Container>
            )}
            {additionalUserInfo?.partying !== undefined && (
              <Container className="border-all align-center px8 py4 br4">
                <p>
                  <FontAwesomeIcon className="mr8" icon={faGlassCheers} />
                  {partyingList[additionalUserInfo?.partying]}
                </p>
              </Container>
            )}
            {additionalUserInfo?.politics !== undefined && (
              <Container className="border-all align-center px8 py4 br4">
                <p>
                  <FontAwesomeIcon className="mr8" icon={faLandmark} />
                  {politicalBeliefsList[additionalUserInfo?.politics]}
                </p>
              </Container>
            )}
            {additionalUserInfo?.religion !== undefined && (
              <Container className="border-all align-center px8 py4 br4">
                <p>
                  <FontAwesomeIcon className="mr8" icon={faPray} />
                  {additionalUserInfo?.religion}
                </p>
              </Container>
            )}
          </Space>
        )}

        {showMessageUser && (
          <Container className="column flex-fill justify-end gap8">
            {(!user || (user && user.uid !== userID)) && (
              <button
                className="x-fill button-2 px16 py8 br8"
                onClick={(e) => {
                  e.preventDefault();

                  const userInteractionIssues = userSignUpProgress(user);

                  if (userInteractionIssues) {
                    if (userInteractionIssues === "NSI") setStarterModal(true);
                    return;
                  }

                  startConversation(user, userID);
                }}
              >
                <FontAwesomeIcon className="mr8" icon={faComments} />
                <p className="ic ellipsis">
                  Message {capitolizeFirstChar(userInfo?.displayName)}
                </p>
              </button>
            )}
            {lastOnline && (
              <p className="x-fill lh-1">
                Last Seen: {dayjs(lastOnline).fromNow()}
              </p>
            )}
          </Container>
        )}
      </Container>
      {starterModal && (
        <StarterModal
          activeModal={starterModal}
          setActiveModal={setStarterModal}
        />
      )}
    </Link>
  );
};

export default UserComponent;
