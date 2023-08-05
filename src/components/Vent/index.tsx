import React, { useContext, useEffect, useRef, useState } from "react";
import { off } from "@firebase/database";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";

import { Button, Dropdown, message } from "antd";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

import CommentType from "../../types/Comment";
import Container from "../containers/Container";
import KarmaBadge from "../views/KarmaBadge";
import LoadingHeart from "../views/loaders/Heart";
import Options from "../Options";
import StarterModal from "../modals/Starter";

import { UserContext } from "../../context";
import {
  capitolizeFirstChar,
  getIsUserOnline,
  getUserBasicInfo,
  hasUserBlockedUser,
  isUserAccountNew,
  isUserKarmaSufficient,
  useIsMounted,
  userSignUpProgressFunction,
  viewTagFunction,
} from "../../util";
import {
  commentVent,
  deleteVent,
  findPossibleUsersToTag,
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
import Vent from "@/types/Vent";
import UserBasicInfo from "@/types/UserBasicInfo";
import MakeAvatar from "../views/MakeAvatar";
import {
  faBirthdayCake,
  faClock,
  faComments,
} from "@fortawesome/free-solid-svg-icons";
import Tag from "@/types/Tag";
import Comment from "../Comment";

dayjs.extend(relativeTime);

const SmartLink = ({ children, className, disablePostOnClick, to }: any) => {
  if (disablePostOnClick || !to) {
    return <Container className={className}>{children}</Container>;
  } else {
    return (
      <Link className={className} href={to}>
        {children}
      </Link>
    );
  }
};

function Vent({
  disablePostOnClick,
  displayCommentField,
  isOnSingleVentPage,
  previewMode,
  searchPreviewMode,
  setTitle,
  ventID,
  ventInit,
}: any) {
  const isMounted = useIsMounted();
  const router = useRouter();
  const textInput = useRef(null);

  const userContext = useContext(UserContext);
  const user = userContext?.user;
  const userBasicInfo = userContext?.userBasicInfo;

  const [activeSort, setActiveSort] = useState("First");
  const [author, setAuthor] = useState<UserBasicInfo>();
  const [canLoadMoreComments, setCanLoadMoreComments] = useState(false);
  const [comments, setComments] = useState<CommentType[]>([]);
  const [commentString, setCommentString] = useState("");
  const [hasLiked, setHasLiked] = useState(false);
  const [isContentBlocked, setIsContentBlocked] = useState(user ? true : false);
  const [isUserOnline, setIsUserOnline] = useState<boolean | string>(false);
  const [starterModal, setStarterModal] = useState(false);
  const [vent, setVent] = useState(ventInit);

  const [isUserAccountNewLocal, setIsUserAccountNewLocal] = useState<Boolean>();
  const [signUpProgressFunction, setSignUpProgressFunction] = useState<any>();
  const [partialLink, setPartialLink] = useState("");
  const [ventPreview, setVentPreview] = useState("");

  useEffect(() => {
    let isUserOnlineSubscribe: any;
    let newCommentListenerUnsubscribe: any;

    const ventSetUp = (newVent: Vent) => {
      isUserOnlineSubscribe = getIsUserOnline((isUserOnline: any) => {
        if (isMounted()) setIsUserOnline(isUserOnline.state);
      }, newVent.userID);

      setPartialLink(getVentPartialLink(newVent));
      setVentPreview(getVentDescription(previewMode, newVent));

      if (setTitle && newVent && newVent.title && isMounted())
        setTitle(newVent.title);

      getUserBasicInfo((author: UserBasicInfo) => {
        if (isMounted()) setAuthor(author);
      }, newVent.userID);

      if (user)
        hasUserBlockedUser(
          isMounted,
          user.uid,
          newVent.userID,
          setIsContentBlocked
        );

      setIsUserAccountNewLocal(isUserAccountNew(userBasicInfo));

      setSignUpProgressFunction(
        userSignUpProgressFunction(setStarterModal, user)
      );

      if (isMounted()) setVent(newVent);
    };

    if (!ventInit) {
      getVent(ventSetUp, ventID);
    } else ventSetUp(ventInit);

    if (!searchPreviewMode && displayCommentField)
      newCommentListenerUnsubscribe = newVentCommentListener(
        isMounted,
        setCanLoadMoreComments,
        setComments,
        user ? user.uid : "",
        ventID
      );

    if (!searchPreviewMode && !previewMode) {
      getVentComments(
        "First",
        undefined,
        isMounted,
        setCanLoadMoreComments,
        setComments,
        false,
        ventID
      );
    }

    if (user && !searchPreviewMode)
      ventHasLiked(
        (newHasLiked: boolean) => {
          if (isMounted()) setHasLiked(newHasLiked);
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
    isMounted,
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
      <Container className="x-fill full-center">
        <LoadingHeart />
      </Container>
    );

  if (isContentBlocked) return <div />;

  return (
    <Container className="x-fill">
      {vent && (
        <Container className="x-fill column bg-white pt16 br8">
          <Container
            className={`column border-bottom gap8 py16 px32 ${
              disablePostOnClick ? "" : "clickable"
            }`}
            onClick={() => {
              if (!disablePostOnClick) router.push(partialLink);
            }}
          >
            <Container className="flex x-fill align-center gap4">
              <MakeAvatar
                displayName={author?.displayName}
                userBasicInfo={author}
              />
              <Container className="flex-fill align-center ov-hidden gap4">
                <Link
                  className="ov-hidden"
                  onClick={(e) => e.stopPropagation()}
                  href={"/profile?" + author?.id}
                >
                  <h3 className="button-1 fs-20 grey-11 ellipsis">
                    {capitolizeFirstChar(author?.displayName)}
                  </h3>
                </Link>
                {isUserOnline === "online" && <div className="online-dot" />}
                <KarmaBadge userBasicInfo={author} />
              </Container>
              {vent.is_birthday_post && (
                <Container className="align-center gap8">
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
                </Container>
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
            </Container>

            {vent.new_tags && vent.new_tags.length > 0 && (
              <Container className="wrap gap8">
                {vent.new_tags.map((tag: string, index: number) => (
                  <Tag key={index} tag={tag} />
                ))}
              </Container>
            )}
          </Container>
          <SmartLink
            className={
              "main-container column border-bottom py16 px32 " +
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
            <Container className="x-fill align-center justify-end">
              <FontAwesomeIcon className="grey-5 mr8" icon={faClock} />
              <p className="grey-5 fs-16">
                {dayjs(vent.server_timestamp).fromNow()}
              </p>
            </Container>
          </SmartLink>

          {!searchPreviewMode && (
            <Container
              className={
                "relative justify-between wrap py16 px32 gap8 " +
                (!searchPreviewMode && displayCommentField
                  ? "border-bottom"
                  : "")
              }
            >
              <Container className="align-center gap16">
                <Container className="align-center gap4">
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
                </Container>

                <SmartLink
                  className="flex align-center gap4"
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
              </Container>

              {(!user || (user && user.uid !== vent.userID && author?.id)) && (
                <Container
                  className="button-2 wrap px16 py8 br8"
                  onClick={() => {
                    if (signUpProgressFunction) return signUpProgressFunction();

                    startConversation(user, vent.userID);
                  }}
                >
                  <FontAwesomeIcon className="mr8" icon={faComments} />
                  <p className="ic ellipsis">
                    Message {capitolizeFirstChar(author?.displayName)}
                  </p>
                </Container>
              )}
            </Container>
          )}

          {!searchPreviewMode && displayCommentField && comments && (
            <Container className="column gap16">
              {vent.comment_counter > 0 && (
                <Container className="border-bottom px32 py16">
                  <Dropdown
                    overlay={
                      <Container className="column bg-white shadow-2 pa8 br8">
                        <p
                          className="button-4 py8"
                          onClick={() => {
                            setActiveSort("First");

                            getVentComments(
                              "First",
                              [],
                              isMounted,
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
                              isMounted,
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
                              isMounted,
                              setCanLoadMoreComments,
                              setComments,
                              false,
                              ventID ? ventID : vent.id
                            );
                          }}
                        >
                          Last
                        </p>
                      </Container>
                    }
                    trigger={["click"]}
                  >
                    <button className="blue">Sort By: {activeSort}</button>
                  </Dropdown>
                </Container>
              )}
              {comments && comments.length > 0 && (
                <Container className="column px32 pb16">
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
                          isMounted,
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
                </Container>
              )}
              {vent.comment_counter === 0 &&
                (!comments || (comments && comments.length === 0)) && (
                  <p className="tac px32 py16">
                    There are no comments yet. Please help this person :)
                  </p>
                )}
            </Container>
          )}
          {displayCommentField && !comments && (
            <Container className="x-fill full-center">
              <LoadingHeart />
            </Container>
          )}

          {!searchPreviewMode && displayCommentField && (
            <Container
              className="sticky column x-fill bg-white border-top shadow-2 br8 pa16"
              style={{ bottom: 0 }}
            >
              {isUserAccountNewLocal && (
                <Link href="/rules">
                  <Button className="blue ml8 mb8" size="large" type="link">
                    Read Our VWS Rules
                  </Button>
                </Link>
              )}
              <Container className="flex-fill align-center gap8">
                {/* <Container className="relative column flex-fill">
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
                          <Container className="flex-fill align-center pa8 gap8">
                            <MakeAvatar
                              displayName={entry.displayName}
                              userBasicInfo={entry}
                            />
                            <Container className="button-7">
                              <h5 className="ellipsis fw-400 mr8">
                                {capitolizeFirstChar(entry.displayName)}
                              </h5>
                            </Container>
                            <KarmaBadge userBasicInfo={entry} noOnClick />
                          </Container>
                        );
                      }}
                      trigger="@"
                    />
                  </MentionsInput> 
                </Container>
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
              </Container>
            </Container>
          )}
        </Container>
      )}

      {starterModal && (
        <StarterModal
          activeModal={starterModal}
          setActiveModal={setStarterModal}
        />
      )}
    </Container>
  );
}

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
