import React, { useContext, useEffect, useRef, useState } from "react";
import { off } from "@firebase/database";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";

import { Button, Dropdown } from "antd";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

import CommentType from "../../types/CommentType";
import KarmaBadge from "../views/KarmaBadge";
import LoadingHeart from "../views/loaders/Heart";
import Options from "../Options";

import { UserContext } from "../../context";
import {
  capitolizeFirstChar,
  getIsUserOnline,
  getUserBasicInfo,
  hasUserBlockedUser,
  isUserAccountNew,
  userSignUpProgressFunction,
  viewTagFunction,
} from "../../util";
import {
  commentVent,
  deleteVent,
  getVent,
  getVentComments,
  getVentDescription,
  getVentPartialLink,
  likeOrUnlikeVent,
  newVentCommentListener,
  reportVent,
  startConversation,
  ventHasLiked,
} from "./util";
import Link from "next/link";
import { useRouter } from "next/navigation";
import Vent from "@/types/VentType";
import UserBasicInfo from "@/types/UserBasicInfo";
import MakeAvatar from "../views/MakeAvatar";
import {
  faBirthdayCake,
  faClock,
  faComments,
} from "@fortawesome/free-solid-svg-icons";
import Comment from "../Comment/Comment";
import { useRecoilState } from "recoil";
import { starterModalAtom } from "@/atoms/ModalVisibility";

dayjs.extend(relativeTime);

const SmartLink = ({ children, className, disablePostOnClick, to }: any) => {
  if (disablePostOnClick || !to) {
    return <div className={className}>{children}</div>;
  } else {
    return (
      <Link className={className} href={to}>
        {children}
      </Link>
    );
  }
};

const Vent = ({
  disablePostOnClick,
  displayCommentField,
  isOnSingleVentPage,
  previewMode,
  searchPreviewMode,
  setTitle,
  ventID,
  ventInit,
}: any) => {
  const router = useRouter();
  const textInput = useRef(null);

  const userContext = useContext(UserContext);
  const [, setStarterModal] = useRecoilState(starterModalAtom);

  const user = userContext?.user;
  const userBasicInfo = userContext?.userBasicInfo;

  const [activeSort, setActiveSort] = useState("First");
  const [author, setAuthor] = useState<UserBasicInfo>();
  const [canLoadMoreComments, setCanLoadMoreComments] = useState(false);
  const [commentString, setCommentString] = useState("");
  const [comments, setComments] = useState<CommentType[]>([]);
  const [hasLiked, setHasLiked] = useState(false);
  const [isContentBlocked, setIsContentBlocked] = useState(user ? true : false);
  const [isUserAccountNewLocal, setIsUserAccountNewLocal] = useState<Boolean>();
  const [isUserOnline, setIsUserOnline] = useState<boolean | string>(false);
  const [partialLink, setPartialLink] = useState("");
  const [signUpProgressFunction, setSignUpProgressFunction] = useState<any>();
  const [vent, setVent] = useState(ventInit);
  const [ventPreview, setVentPreview] = useState("");

  useEffect(() => {
    let isUserOnlineSubscribe: any;
    let newCommentListenerUnsubscribe: any;

    const ventSetUp = (newVent: Vent) => {
      isUserOnlineSubscribe = getIsUserOnline((isUserOnline: any) => {
        setIsUserOnline(isUserOnline.state);
      }, newVent.userID);

      setPartialLink(getVentPartialLink(newVent));
      setVentPreview(getVentDescription(previewMode, newVent));

      if (setTitle && newVent && newVent.title) setTitle(newVent.title);

      getUserBasicInfo((author: UserBasicInfo) => {
        setAuthor(author);
      }, newVent.userID);

      if (user)
        hasUserBlockedUser(user.uid, newVent.userID, setIsContentBlocked);

      setIsUserAccountNewLocal(isUserAccountNew(userBasicInfo));

      setSignUpProgressFunction(
        userSignUpProgressFunction(setStarterModal, user)
      );

      setVent(newVent);
    };

    if (!ventInit) {
      getVent(ventSetUp, ventID);
    } else ventSetUp(ventInit);

    if (!searchPreviewMode && displayCommentField)
      newCommentListenerUnsubscribe = newVentCommentListener(
        setCanLoadMoreComments,
        setComments,
        user ? user.uid : "",
        ventID
      );

    if (!searchPreviewMode && !previewMode) {
      getVentComments(
        "First",
        undefined,

        setCanLoadMoreComments,
        setComments,
        false,
        ventID
      );
    }

    if (user && !searchPreviewMode)
      ventHasLiked(
        (newHasLiked: boolean) => {
          setHasLiked(newHasLiked);
        },
        user.uid,
        ventID
      );

    return () => {
      if (isUserOnlineSubscribe) off(isUserOnlineSubscribe);
      if (newCommentListenerUnsubscribe) newCommentListenerUnsubscribe();
    };
  }, [
    displayCommentField,

    previewMode,
    searchPreviewMode,
    setTitle,
    user,
    userBasicInfo,
    ventInit,
    ventID,
  ]);

  if ((!vent || (vent && !vent.server_timestamp)) && isOnSingleVentPage)
    return (
      <div className="w-full full-center">
        <LoadingHeart />
      </div>
    );

  if (isContentBlocked) return <div />;

  return (
    <div className="w-full">
      {vent && (
        <div className="w-full flex flex-col bg-white pt16 br8">
          <div
            className={`flex flex-col border-bottom gap-2 py16 px32 ${
              disablePostOnClick ? "" : "clickable"
            }`}
            onClick={() => {
              if (!disablePostOnClick) router.push(partialLink);
            }}
          >
            <div className="flex w-full items-center gap-1">
              <MakeAvatar
                displayName={author?.displayName}
                userBasicInfo={author}
              />
              <div className="grow items-center overflow-hidden gap-1">
                <Link
                  className="overflow-hidden"
                  onClick={(e) => e.stopPropagation()}
                  href={"/profile?" + author?.id}
                >
                  <h3 className="button-1 fs-20 grey-11 ellipsis">
                    {capitolizeFirstChar(author?.displayName)}
                  </h3>
                </Link>
                {isUserOnline === "online" && <div className="online-dot" />}
                <KarmaBadge userBasicInfo={author} />
              </div>
              {vent.is_birthday_post && (
                <div className="items-center gap-2">
                  <FontAwesomeIcon
                    className="orange"
                    icon={faBirthdayCake}
                    size="3x"
                  />
                  <FontAwesomeIcon
                    className="purple"
                    icon={faBirthdayCake}
                    size="3x"
                  />
                </div>
              )}
              {user && (
                <Options
                  canUserInteractFunction={
                    signUpProgressFunction ? signUpProgressFunction : false
                  }
                  deleteFunction={(ventID: string) => {
                    deleteVent(router, ventID);
                  }}
                  editFunction={() => {
                    router.push("/vent-to-strangers?" + vent.id);
                  }}
                  objectID={vent.id}
                  objectUserID={vent.userID}
                  reportFunction={(option: any) => {
                    if (signUpProgressFunction) return signUpProgressFunction();

                    reportVent(option, user.uid, vent.id);
                  }}
                  userID={user.uid}
                />
              )}
            </div>

            {vent.new_tags && vent.new_tags.length > 0 && (
              <div className="flex- gap-2">
                {vent.new_tags.map((tag: string, index: number) => (
                  <Tag key={index} tag={tag} />
                ))}
              </div>
            )}
          </div>
          <SmartLink
            className={
              "main-container flex flex-col border-bottom py16 px32 " +
              (disablePostOnClick ? "" : "clickable")
            }
            disablePostOnClick={disablePostOnClick}
            href={vent && vent.title && vent.id ? partialLink : ""}
          >
            {setTitle && <h1 className="fs-20 primary mb8">{vent.title}</h1>}
            {!setTitle && <h6 className="fs-20 primary mb8">{vent.title}</h6>}

            <p
              className="fw-400 grey-1 description"
              style={{
                WebkitLineClamp: displayCommentField ? 150 : 3,
                lineClamp: displayCommentField ? 150 : 3,
              }}
            >
              {ventPreview}
            </p>
            <div className="w-full items-center justify-end">
              <FontAwesomeIcon className="grey-5 mr8" icon={faClock} />
              <p className="grey-5 fs-16">
                {dayjs(vent.server_timestamp).fromNow()}
              </p>
            </div>
          </SmartLink>

          {!searchPreviewMode && (
            <div
              className={
                "relative justify-between flex-wrap py16 px32 gap-2 " +
                (!searchPreviewMode && displayCommentField
                  ? "border-bottom"
                  : "")
              }
            >
              <div className="items-center gap-4">
                <div className="items-center gap-1">
                  <img
                    alt="Support"
                    className={`clickable heart ${hasLiked ? "red" : "grey-5"}`}
                    onClick={(e) => {
                      e.preventDefault();

                      if (signUpProgressFunction)
                        return signUpProgressFunction();

                      likeOrUnlikeVent(
                        hasLiked,
                        setHasLiked,
                        setVent,
                        user,
                        vent
                      );
                    }}
                    src={
                      hasLiked
                        ? "/svgs/support-active.svg"
                        : "/svgs/support.svg"
                    }
                    style={{ height: "32px", width: "32px" }}
                    title="Give Support :)"
                  />
                  <p className="grey-5">
                    {vent.like_counter ? vent.like_counter : 0}
                  </p>
                </div>

                <SmartLink
                  className="flex items-center gap-1"
                  disablePostOnClick={disablePostOnClick}
                  href={vent && vent.title && vent.id ? partialLink : ""}
                >
                  <FontAwesomeIcon
                    className="clickable blue"
                    icon={faComments}
                    onClick={() => {
                      // @ts-ignore
                      if (disablePostOnClick) textInput?.current?.focus();
                    }}
                    size="2x"
                  />
                  <p className="grey-5">
                    {vent.comment_counter ? vent.comment_counter : 0}
                  </p>
                </SmartLink>
              </div>

              {(!user || (user && user.uid !== vent.userID && author?.id)) && (
                <div
                  className="button-2 flex-wrap px16 py8 br8"
                  onClick={() => {
                    if (signUpProgressFunction) return signUpProgressFunction();

                    startConversation(user, vent.userID);
                  }}
                >
                  <FontAwesomeIcon className="mr8" icon={faComments} />
                  <p className="ic ellipsis">
                    Message {capitolizeFirstChar(author?.displayName)}
                  </p>
                </div>
              )}
            </div>
          )}

          {!searchPreviewMode && displayCommentField && comments && (
            <div className="flex flex-col gap-4">
              {vent.comment_counter > 0 && (
                <div className="border-bottom px32 py16">
                  <Dropdown
                    overlay={
                      <div className="flex flex-col bg-white shadow-2 pa8 br8">
                        <p
                          className="button-4 py8"
                          onClick={() => {
                            setActiveSort("First");

                            getVentComments(
                              "First",
                              [],

                              setCanLoadMoreComments,
                              setComments,
                              false,
                              ventID ? ventID : vent.id
                            );
                          }}
                        >
                          First
                        </p>
                        <p
                          className="button-4 py8"
                          onClick={() => {
                            setActiveSort("Best");

                            getVentComments(
                              "Best",
                              [],

                              setCanLoadMoreComments,
                              setComments,
                              false,
                              ventID ? ventID : vent.id
                            );
                          }}
                        >
                          Best
                        </p>
                        <p
                          className="button-4 py8"
                          onClick={() => {
                            setActiveSort("Last");

                            getVentComments(
                              "Last",
                              [],

                              setCanLoadMoreComments,
                              setComments,
                              false,
                              ventID ? ventID : vent.id
                            );
                          }}
                        >
                          Last
                        </p>
                      </div>
                    }
                    trigger={["click"]}
                  >
                    <button className="blue">Sort By: {activeSort}</button>
                  </Dropdown>
                </div>
              )}
              {comments && comments.length > 0 && (
                <div className="flex flex-col px32 pb16">
                  {comments.map((comment: CommentType, index) => {
                    return (
                      <Comment
                        arrayLength={comments.length}
                        commentID={comment.id}
                        commentIndex={index}
                        comment2={comment}
                        setComments={setComments}
                        key={comment.id}
                      />
                    );
                  })}
                  {canLoadMoreComments && (
                    <button
                      className="blue underline"
                      onClick={() => {
                        getVentComments(
                          activeSort,
                          comments,

                          setCanLoadMoreComments,
                          setComments,
                          true,
                          vent.id
                        );
                      }}
                      key={comments.length}
                    >
                      Load More Comments
                    </button>
                  )}
                </div>
              )}
              {vent.comment_counter === 0 &&
                (!comments || (comments && comments.length === 0)) && (
                  <p className="text-center px32 py16">
                    There are no comments yet. Please help this person :)
                  </p>
                )}
            </div>
          )}
          {displayCommentField && !comments && (
            <div className="w-full full-center">
              <LoadingHeart />
            </div>
          )}

          {!searchPreviewMode && displayCommentField && (
            <div
              className="sticky flex flex-col w-full bg-white border-top shadow-2 br8 pa16"
              style={{ bottom: 0 }}
            >
              {isUserAccountNewLocal && (
                <Link href="/rules">
                  <Button className="blue ml8 mb8" size="large" type="link">
                    Read Our VWS Rules
                  </Button>
                </Link>
              )}
              <div className="grow items-center gap-2">
                {/* <div className="relative flex flex-col grow">
                  <MentionsInput
                    className="mentions"
                    onChange={(e) => {
                      if (signUpProgressFunction)
                        return signUpProgressFunction();

                      if (!isUserKarmaSufficient(userBasicInfo))
                        return message.error(
                          "Your karma is too low to interact with this"
                        );

                      setCommentString(e.target.value);
                    }}
                    placeholder="Say something nice :)"
                    inputRef={textInput}
                    value={commentString}
                  >
                    <Mention
                      className="mentions__mention"
                      data={(currentTypingTag, callback) => {
                        findPossibleUsersToTag(
                          currentTypingTag,
                          vent.id,
                          callback
                        );
                      }}
                      markup="@[__display__](__id__)"
                      renderSuggestion={(entry) => {
                        return (
                          <div className="grow items-center pa8 gap-2">
                            <MakeAvatar
                              displayName={entry.displayName}
                              userBasicInfo={entry}
                            />
                            <div className="button-7">
                              <h5 className="ellipsis fw-400 mr8">
                                {capitolizeFirstChar(entry.displayName)}
                              </h5>
                            </div>
                            <KarmaBadge userBasicInfo={entry} noOnClick />
                          </div>
                        );
                      }}
                      trigger="@"
                    />
                  </MentionsInput> 
                </div>
                */}
                <Button
                  onClick={async () => {
                    if (signUpProgressFunction) return signUpProgressFunction();

                    if (!commentString) return;
                    commentVent(commentString, setVent, user, vent, vent.id);

                    setCommentString("");
                  }}
                  size="large"
                  type="primary"
                >
                  Send
                </Button>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

function Tag({ tag }: { tag: string }) {
  return (
    <Link
      className="button-4 fs-16"
      key={tag}
      onClick={(e) => e.stopPropagation()}
      href={"/tags/" + tag}
    >
      {viewTagFunction(tag)}
    </Link>
  );
}
export default Vent;
