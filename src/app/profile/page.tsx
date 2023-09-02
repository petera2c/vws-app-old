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
import Page from "@/components/containers/Page/Page";
import ConfirmAlertModal from "@/components/modals/ConfirmAlert/ConfirmAlert";
import Link from "next/link";
import {
  faBaby,
  faComments,
  faEllipsisV,
  faGlassCheers,
  faLandmark,
  faPray,
  faSchool,
  faSpaceShuttle,
  faUserLock,
} from "@fortawesome/free-solid-svg-icons";
import { useRouter } from "next/navigation";
import MakeAvatar from "@/components/views/MakeAvatar";
import Comment from "@/components/Comment/Comment";
import CommentType from "@/types/CommentType";
import Vent from "@/components/Vent/Vent";
import VentType from "@/types/VentType";

dayjs.extend(relativeTime);

function ProfileSection() {
  const router = useRouter();
  const { user } = useContext(UserContext);

  let { search } = location;

  const [blockModal, setBlockModal] = useState(false);
  const [canLoadMoreComments, setCanLoadMoreComments] = useState(true);
  const [canLoadMoreVents, setCanLoadMoreVents] = useState(true);
  const [isFollowing, setIsFollowing] = useState();
  const [isMobileOrTablet, setIsMobileOrTablet] = useState<boolean>();
  const [isUserOnline, setIsUserOnline] = useState<any>(false);
  const [postsSection, setPostsSection] = useState(true);
  const [starterModal, setStarterModal] = useState(false);
  const [userBasicInfo, setUserBasicInfo] = useState<UserBasicInfo>();
  const [userInfo, setUserInfo] = useState<any>({});

  const [vents, setVents] = useState([]);
  const [comments, setComments] = useState([]);

  if (search) search = search.substring(1);
  if (!search && user) search = user.uid;

  const isActive = (page: boolean) => {
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
    } else router.push("/");

    getUsersVents(search, setCanLoadMoreVents, setVents, []);
    getUsersComments(search, setCanLoadMoreComments, setComments, []);

    return () => {
      if (isUserOnlineSubscribe) off(isUserOnlineSubscribe);
    };
  }, [search, user]);

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
      <div className="grow w-full">
        <div
          className="flex flex-col grow gap16"
          style={{
            maxWidth: isMobileOrTablet ? "" : "calc(100% - 316px)",
          }}
        >
          {search && (
            <div className="flex flex-col w-full overflow-hidden bg-white pa16 gap8 br8">
              <div className="w-full full-center">
                <MakeAvatar
                  displayName={userBasicInfo?.displayName}
                  size="large"
                  userBasicInfo={userBasicInfo}
                />
              </div>

              <div className="wrap gap16">
                <div className="flex flex-col">
                  <div className="items-center gap8">
                    {isUserOnline && isUserOnline?.state === "online" && (
                      <div className="online-dot" />
                    )}
                    <h1 className="ellipsis">
                      {capitolizeFirstChar(userBasicInfo?.displayName)}
                    </h1>
                    <KarmaBadge userBasicInfo={userBasicInfo} />
                  </div>
                  <p>{calculateKarma(userBasicInfo)} Karma Points</p>
                </div>

                {(Boolean(dayjs().year() - dayjs(userInfo.birth_date).year()) ||
                  userInfo.gender ||
                  userInfo.pronouns) && (
                  <div>
                    {Boolean(
                      dayjs().year() - dayjs(userInfo.birth_date).year()
                    ) && (
                      <div className="flex flex-col">
                        <h6>Age</h6>
                        <p>
                          {dayjs().diff(dayjs(userInfo.birth_date), "years")}
                        </p>
                      </div>
                    )}

                    {userInfo.gender && (
                      <div className="flex flex-col ml8">
                        <h6>Gender</h6>
                        <p>{userInfo.gender}</p>
                      </div>
                    )}
                    {userInfo.pronouns && (
                      <div className="flex flex-col ml8">
                        <h6>Pronouns</h6>
                        <p>{userInfo.pronouns}</p>
                      </div>
                    )}
                  </div>
                )}
                {userBasicInfo?.server_timestamp && (
                  <div className="flex flex-col">
                    <h6>Created Account</h6>
                    <p>
                      {dayjs(userBasicInfo.server_timestamp).format(
                        "MMMM D YYYY"
                      )}
                    </p>
                  </div>
                )}
              </div>

              {userInfo.bio && (
                <div className="flex flex-col">
                  <h6>Bio</h6>
                  <p className="break-word grey-1">{userInfo.bio}</p>
                </div>
              )}

              {(userInfo.education !== undefined ||
                userInfo.kids !== undefined ||
                userInfo.partying !== undefined ||
                userInfo.politics !== undefined ||
                userInfo.religion !== undefined) && (
                <div className="wrap gap8">
                  {userInfo.education !== undefined && (
                    <div className="border-all items-center px8 py4 br4">
                      <FontAwesomeIcon className="mr8" icon={faSchool} />
                      <p>{educationList[userInfo.education]}</p>
                    </div>
                  )}
                  {userInfo.kids !== undefined && (
                    <div className="border-all items-center px8 py4 br4">
                      <FontAwesomeIcon className="mr8" icon={faBaby} />
                      <p>{kidsList[userInfo.kids]}</p>
                    </div>
                  )}
                  {userInfo.partying !== undefined && (
                    <div className="border-all items-center px8 py4 br4">
                      <FontAwesomeIcon className="mr8" icon={faGlassCheers} />
                      <p>{partyingList[userInfo.partying]}</p>
                    </div>
                  )}
                  {userInfo.politics !== undefined && (
                    <div className="border-all items-center px8 py4 br4">
                      <FontAwesomeIcon className="mr8" icon={faLandmark} />
                      <p>{politicalBeliefsList[userInfo.politics]}</p>
                    </div>
                  )}
                  {userInfo.religion !== undefined && (
                    <div className="border-all items-center px8 py4 br4">
                      <FontAwesomeIcon className="mr8" icon={faPray} />
                      <p>{userInfo.religion}</p>
                    </div>
                  )}
                </div>
              )}
              {userBasicInfo?.displayName &&
                search &&
                (user ? search !== user.uid : true) && (
                  <div className="items-center justify-between">
                    <div
                      className="button-2 wrap px16 py8 br8"
                      onClick={() => {
                        const userInteractionIssues = userSignUpProgress(user);

                        if (userInteractionIssues) {
                          if (userInteractionIssues === "NSI")
                            setStarterModal(true);
                          return;
                        }

                        // startConversation(user);
                      }}
                    >
                      <FontAwesomeIcon className="mr8" icon={faComments} />
                      <p className="ic ellipsis">
                        Message {capitolizeFirstChar(userBasicInfo.displayName)}
                      </p>
                    </div>
                    <div
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
                          user!.uid,
                          userBasicInfo.id
                        );
                      }}
                    >
                      <FontAwesomeIcon
                        className="mr8"
                        icon={faSpaceShuttle}
                        size="2x"
                      />
                      <p className="ic ellipsis">
                        {isFollowing ? "Unfollow" : "Follow"}{" "}
                        {capitolizeFirstChar(userBasicInfo.displayName)}
                      </p>
                    </div>
                  </div>
                )}

              <div className="w-full items-center justify-between">
                <div>
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
                </div>
                {userBasicInfo?.displayName &&
                  search &&
                  user &&
                  search !== user.uid && (
                    <Dropdown
                      overlay={
                        <div className="flex flex-col w-full bg-white border-all px16 py8 br8">
                          <div
                            className="button-8 clickable items-center"
                            onClick={(e: any) => {
                              e.preventDefault();
                              setBlockModal(!blockModal);
                            }}
                          >
                            <p className=" grow">Block Person</p>
                            <FontAwesomeIcon
                              className="ml8"
                              icon={faUserLock}
                            />
                          </div>
                        </div>
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
              </div>
            </div>
          )}

          <h2 className="primary bold fs-26">Activity</h2>
          <div className="overflow-hidden flex flex-col bg-white br8">
            <div>
              <div
                className={
                  "x-50 button-4 clickable full-center py16" +
                  isActive(postsSection)
                }
                onClick={() => setPostsSection(true)}
              >
                <h5 className="text-center ic">Posts</h5>
              </div>
              <div
                className={
                  "x-50 button-4 clickable full-center py16" +
                  isActive(!postsSection)
                }
                onClick={() => {
                  setPostsSection(false);
                }}
              >
                <h5 className="text-center ic">Comments</h5>
              </div>
            </div>
          </div>
          {postsSection && (
            <InfiniteScroll
              dataLength={vents.length}
              endMessage={
                vents.length !== 0 ? (
                  <p className="primary text-center mt16">
                    <b>Yay! You have seen it all</b>
                  </p>
                ) : (
                  <div />
                )
              }
              hasMore={canLoadMoreVents}
              loader={
                <div className="w-full full-center">
                  <LoadingHeart />
                </div>
              }
              next={() =>
                getUsersVents(search, setCanLoadMoreVents, setVents, vents)
              }
              scrollableTarget="scrollable-div"
            >
              <Space className="w-full" direction="vertical" size="middle">
                {vents &&
                  vents.map((vent: VentType, index) => (
                    <Vent
                      key={index}
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
            <div className="w-full flex flex-col">
              {comments && comments.length > 0 && (
                <div className="flex flex-col bg-white br8 px32 py16">
                  {comments &&
                    comments.map((comment: CommentType, index) => {
                      return (
                        <Link
                          key={index}
                          href={"/vent/" + comment.ventID + "/"}
                        >
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
                </div>
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
            </div>
          )}
          {((!vents && postsSection) || (!comments && !postsSection)) && (
            <div className="w-full full-center">
              <LoadingHeart />
            </div>
          )}
        </div>

        <SubscribeColumn slot="8314288538" />
      </div>
      {blockModal && (
        <ConfirmAlertModal
          close={() => setBlockModal(false)}
          message="Blocking this user will remove you from all conversations with this user and you will no longer see any of their vents or comments. Are you sure you would like to block this user?"
          submit={() => {
            blockUser(user!.uid, search);
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
