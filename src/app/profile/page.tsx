"use client";
import React, { useContext, useEffect, useState } from "react";
import { off } from "firebase/database";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import InfiniteScroll from "react-infinite-scroll-component";
import { Button, Dropdown, Space } from "antd";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

import KarmaBadge from "../../components/views/KarmaBadge";
import LoadingHeart from "../../components/views/loaders/Heart";
import StarterModal from "../../components/modals/Starter";
import SubscribeColumn from "../../components/SubscribeColumn";

import { UserContext } from "../../context";

import { startConversation } from "../../components/Vent/util";
import {
  educationList,
  kidsList,
  partyingList,
  politicalBeliefsList,
} from "../../PersonalOptions";
import {
  blockUser,
  calculateKarma,
  capitolizeFirstChar,
  getIsMobileOrTablet,
  getIsUserOnline,
  getUserBasicInfo,
  userSignUpProgress,
} from "../../util";
import {
  followOrUnfollowUser,
  getIsFollowing,
  getUser,
  getUsersComments,
  getUsersVents,
} from "../account/util";
import UserBasicInfo from "@/types/UserBasicInfo";
import Container from "@/components/containers/Container/Container";
import Page from "@/components/containers/Page/Page";

const MakeAvatar = loadable(() => import("../../components/views/MakeAvatar"));

dayjs.extend(relativeTime);

function ProfileSection() {
  const { user } = useContext(UserContext);

  const navigate = useNavigate();
  const location = useLocation();
  let { search } = location;

  const [blockModal, setBlockModal] = useState(false);
  const [canLoadMoreComments, setCanLoadMoreComments] = useState(true);
  const [canLoadMoreVents, setCanLoadMoreVents] = useState(true);
  const [isFollowing, setIsFollowing] = useState();
  const [isMobileOrTablet, setIsMobileOrTablet] = useState<boolean>();
  const [isUserOnline, setIsUserOnline] = useState(false);
  const [postsSection, setPostsSection] = useState(true);
  const [starterModal, setStarterModal] = useState(false);
  const [userBasicInfo, setUserBasicInfo] = useState({});
  const [userInfo, setUserInfo] = useState({});

  const [vents, setVents] = useState([]);
  const [comments, setComments] = useState([]);

  if (search) search = search.substring(1);
  if (!search && user) search = user.uid;

  const isActive = (page: string) => {
    if (page) return " active";
    else return "";
  };

  useEffect(() => {
    let isUserOnlineSubscribe: any;
    setIsMobileOrTablet(getIsMobileOrTablet());

    setVents([]);
    setComments([]);

    if (search) {
      isUserOnlineSubscribe = getIsUserOnline((isUserOnline: boolean) => {
        setIsUserOnline(isUserOnline);
      }, search);
      getUserBasicInfo((userBasicInfo: UserBasicInfo) => {
        setUserBasicInfo(userBasicInfo);
      }, search);
      getUser((userInfo: any) => {
        setUserInfo(userInfo);

        if (user) getIsFollowing(setIsFollowing, user.uid, search);
      }, search);
    } else navigate("/");

    getUsersVents(search, setCanLoadMoreVents, setVents, []);
    getUsersComments(search, setCanLoadMoreComments, setComments, []);

    return () => {
      if (isUserOnlineSubscribe) off(isUserOnlineSubscribe);
    };
  }, [navigate, search, user]);

  return (
    <Page
      className="pa16"
      id="scrollable-div"
      title={
        userBasicInfo && userBasicInfo.displayName
          ? capitolizeFirstChar(userBasicInfo.displayName) +
            "'s Profile and Recent Activity"
          : null
      }
    >
      <Container className="flex-fill x-fill">
        <Container
          className="column flex-fill gap16"
          style={{
            maxWidth: isMobileOrTablet ? "" : "calc(100% - 316px)",
          }}
        >
          {search && (
            <Container className="column x-fill ov-hidden bg-white pa16 gap8 br8">
              <Container className="x-fill full-center">
                <MakeAvatar
                  displayName={userBasicInfo.displayName}
                  size="large"
                  userBasicInfo={userBasicInfo}
                />
              </Container>

              <Container className="wrap gap16">
                <Container className="column">
                  <Container className="align-center gap8">
                    {isUserOnline && isUserOnline.state === "online" && (
                      <div className="online-dot" />
                    )}
                    <h1 className="ellipsis">
                      {capitolizeFirstChar(userBasicInfo.displayName)}
                    </h1>
                    <KarmaBadge userBasicInfo={userBasicInfo} />
                  </Container>
                  <p>{calculateKarma(userBasicInfo)} Karma Points</p>
                </Container>

                {(Boolean(
                  new dayjs().year() - new dayjs(userInfo.birth_date).year()
                ) ||
                  userInfo.gender ||
                  userInfo.pronouns) && (
                  <Container>
                    {Boolean(
                      new dayjs().year() - new dayjs(userInfo.birth_date).year()
                    ) && (
                      <Container className="column">
                        <h6>Age</h6>
                        <p>
                          {new dayjs().diff(
                            new dayjs(userInfo.birth_date),
                            "years"
                          )}
                        </p>
                      </Container>
                    )}

                    {userInfo.gender && (
                      <Container className="column ml8">
                        <h6>Gender</h6>
                        <p>{userInfo.gender}</p>
                      </Container>
                    )}
                    {userInfo.pronouns && (
                      <Container className="column ml8">
                        <h6>Pronouns</h6>
                        <p>{userInfo.pronouns}</p>
                      </Container>
                    )}
                  </Container>
                )}
                {userBasicInfo.server_timestamp && (
                  <Container className="column">
                    <h6>Created Account</h6>
                    <p>
                      {new dayjs(userBasicInfo.server_timestamp).format(
                        "MMMM D YYYY"
                      )}
                    </p>
                  </Container>
                )}
              </Container>

              {userInfo.bio && (
                <Container className="column">
                  <h6>Bio</h6>
                  <p className="break-word grey-1">{userInfo.bio}</p>
                </Container>
              )}

              {(userInfo.education !== undefined ||
                userInfo.kids !== undefined ||
                userInfo.partying !== undefined ||
                userInfo.politics !== undefined ||
                userInfo.religion !== undefined) && (
                <Container className="wrap gap8">
                  {userInfo.education !== undefined && (
                    <Container className="border-all align-center px8 py4 br4">
                      <FontAwesomeIcon className="mr8" icon={faSchool} />
                      <p>{educationList[userInfo.education]}</p>
                    </Container>
                  )}
                  {userInfo.kids !== undefined && (
                    <Container className="border-all align-center px8 py4 br4">
                      <FontAwesomeIcon className="mr8" icon={faBaby} />
                      <p>{kidsList[userInfo.kids]}</p>
                    </Container>
                  )}
                  {userInfo.partying !== undefined && (
                    <Container className="border-all align-center px8 py4 br4">
                      <FontAwesomeIcon className="mr8" icon={faGlassCheers} />
                      <p>{partyingList[userInfo.partying]}</p>
                    </Container>
                  )}
                  {userInfo.politics !== undefined && (
                    <Container className="border-all align-center px8 py4 br4">
                      <FontAwesomeIcon className="mr8" icon={faLandmark} />
                      <p>{politicalBeliefsList[userInfo.politics]}</p>
                    </Container>
                  )}
                  {userInfo.religion !== undefined && (
                    <Container className="border-all align-center px8 py4 br4">
                      <FontAwesomeIcon className="mr8" icon={faPray} />
                      <p>{userInfo.religion}</p>
                    </Container>
                  )}
                </Container>
              )}
              {userBasicInfo.displayName &&
                search &&
                (user ? search !== user.uid : true) && (
                  <Container className="align-center justify-between">
                    <Container
                      className="button-2 wrap px16 py8 br8"
                      onClick={() => {
                        const userInteractionIssues = userSignUpProgress(user);

                        if (userInteractionIssues) {
                          if (userInteractionIssues === "NSI")
                            setStarterModal(true);
                          return;
                        }

                        startConversation(navigate, user, search);
                      }}
                    >
                      <FontAwesomeIcon className="mr8" icon={faComments} />
                      <p className="ic ellipsis">
                        Message {capitolizeFirstChar(userBasicInfo.displayName)}
                      </p>
                    </Container>
                    <Container
                      className="button-2 wrap px16 py8 br8"
                      onClick={() => {
                        const userInteractionIssues = userSignUpProgress(user);

                        if (userInteractionIssues) {
                          if (userInteractionIssues === "NSI")
                            setStarterModal(true);
                          return;
                        }

                        followOrUnfollowUser(
                          !isFollowing,
                          setIsFollowing,
                          user.uid,
                          userBasicInfo.id
                        );
                      }}
                    >
                      <FontAwesomeIcon
                        className="mr8"
                        icon={faComet}
                        size="2x"
                      />
                      <p className="ic ellipsis">
                        {isFollowing ? "Unfollow" : "Follow"}{" "}
                        {capitolizeFirstChar(userBasicInfo.displayName)}
                      </p>
                    </Container>
                  </Container>
                )}

              <Container className="x-fill align-center justify-between">
                <Container>
                  {isUserOnline &&
                    (isUserOnline.index || isUserOnline.last_online) && (
                      <p>
                        Last Seen:{" "}
                        {dayjs(
                          isUserOnline.last_online
                            ? isUserOnline.last_online
                            : isUserOnline.index
                        ).fromNow()}
                      </p>
                    )}
                </Container>
                {userBasicInfo.displayName &&
                  search &&
                  user &&
                  search !== user.uid && (
                    <Dropdown
                      overlay={
                        <Container className="column x-fill bg-white border-all px16 py8 br8">
                          <Container
                            className="button-8 clickable align-center"
                            onClick={(e) => {
                              e.preventDefault();
                              setBlockModal(!blockModal);
                            }}
                          >
                            <p className=" flex-fill">Block Person</p>
                            <FontAwesomeIcon
                              className="ml8"
                              icon={faUserLock}
                            />
                          </Container>
                        </Container>
                      }
                      placement="bottomRight"
                      trigger={["click"]}
                    >
                      <FontAwesomeIcon
                        className="clickable grey-9"
                        icon={faEllipsisV}
                        size="2x"
                        style={{ width: "50px" }}
                      />
                    </Dropdown>
                  )}
              </Container>
            </Container>
          )}

          <h2 className="primary bold fs-26">Activity</h2>
          <Container className="ov-hidden column bg-white br8">
            <Container>
              <Container
                className={
                  "x-50 button-4 clickable full-center py16" +
                  isActive(postsSection)
                }
                onClick={() => setPostsSection(true)}
              >
                <h5 className="tac ic">Posts</h5>
              </Container>
              <Container
                className={
                  "x-50 button-4 clickable full-center py16" +
                  isActive(!postsSection)
                }
                onClick={() => {
                  setPostsSection(false);
                }}
              >
                <h5 className="tac ic">Comments</h5>
              </Container>
            </Container>
          </Container>
          {postsSection && (
            <InfiniteScroll
              dataLength={vents.length}
              endMessage={
                vents.length !== 0 ? (
                  <p className="primary tac mt16">
                    <b>Yay! You have seen it all</b>
                  </p>
                ) : (
                  <div />
                )
              }
              hasMore={canLoadMoreVents}
              loader={
                <Container className="x-fill full-center">
                  <LoadingHeart />
                </Container>
              }
              next={() =>
                getUsersVents(search, setCanLoadMoreVents, setVents, vents)
              }
              scrollableTarget="scrollable-div"
            >
              <Space className="x-fill" direction="vertical" size="middle">
                {vents &&
                  vents.map((vent, index) => (
                    <Vent
                      key={index}
                      navigate={navigate}
                      previewMode={true}
                      ventID={vent.id}
                      ventInit={vent}
                    />
                  ))}
                {vents && vents.length === 0 && <h4>No vents found.</h4>}
              </Space>
            </InfiniteScroll>
          )}
          {!postsSection && (
            <Container className="x-fill column">
              {comments && comments.length > 0 && (
                <Container className="column bg-white br8 px32 py16">
                  {comments &&
                    comments.map((comment, index) => {
                      return (
                        <Link key={index} to={"/vent/" + comment.ventID + "/"}>
                          <Comment
                            arrayLength={comments.length}
                            commentID={comment.id}
                            commentIndex={index}
                            comment2={comment}
                            key={index}
                          />
                        </Link>
                      );
                    })}
                </Container>
              )}
              {comments && comments.length === 0 && <h4>No comments found.</h4>}
              {canLoadMoreComments && (
                <Button
                  block
                  className="mt16"
                  onClick={() =>
                    getUsersComments(
                      search,
                      setCanLoadMoreComments,
                      setComments,
                      comments
                    )
                  }
                  size="large"
                  type="primary"
                >
                  Load More Comments
                </Button>
              )}
            </Container>
          )}
          {((!vents && postsSection) || (!comments && !postsSection)) && (
            <Container className="x-fill full-center">
              <LoadingHeart />
            </Container>
          )}
        </Container>

        <SubscribeColumn slot="8314288538" />
      </Container>
      {blockModal && (
        <ConfirmAlertModal
          close={() => setBlockModal(false)}
          message="Blocking this user will remove you from all conversations with this user and you will no longer see any of their vents or comments. Are you sure you would like to block this user?"
          submit={() => {
            blockUser(user.uid, search);
          }}
          title="Block User"
        />
      )}
      {starterModal && (
        <StarterModal
          activeModal={starterModal}
          setActiveModal={setStarterModal}
        />
      )}
    </Page>
  );
}

export default ProfileSection;
