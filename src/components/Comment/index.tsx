import React, { useContext, useEffect, useState } from "react";
import { off } from "@firebase/database";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";

import { faHeart } from "@fortawesome/free-regular-svg-icons/faHeart";
import { faHeart as faHeart2 } from "@fortawesome/free-solid-svg-icons/faHeart";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

import Container from "../containers/Container";
import DisplayName from "../views/DisplayName";
import Options from "../Options";
import StarterModal from "../modals/Starter";

import { UserContext } from "../../context";

import {
  getIsUserOnline,
  getUserBasicInfo,
  hasUserBlockedUser,
  useIsMounted,
  userSignUpProgress,
} from "../../util";
import { findPossibleUsersToTag } from "../Vent/util";
import {
  deleteComment,
  editComment,
  getCommentHasLiked,
  likeOrUnlikeComment,
  reportComment,
  swapTags,
} from "./util.tsx";
import UserBasicInfo from "@/types/UserBasicInfo";
import { faClock } from "@fortawesome/free-solid-svg-icons";
dayjs.extend(relativeTime);

function Comment({
  arrayLength,
  comment2,
  commentID,
  commentIndex,
  setComments,
}: {
  arrayLength: number;
  comment2: any;
  commentID: string;
  commentIndex: number;
  setComments: any;
}) {
  const isMounted = useIsMounted();
  const { user } = useContext(UserContext);

  const [comment, setComment] = useState(comment2);
  const [commentString, setCommentString] = useState("");
  const [editingComment, setEditingComment] = useState(false);
  const [hasLiked, setHasLiked] = useState(false);
  const [isContentBlocked, setIsContentBlocked] = useState(user ? true : false);
  const [isUserOnline, setIsUserOnline] = useState(false);
  const [starterModal, setStarterModal] = useState(false);
  const [userBasicInfo, setUserBasicInfo] = useState<UserBasicInfo>();

  useEffect(() => {
    let isUserOnlineSubscribe: any;

    if (user) {
      getCommentHasLiked(
        commentID,
        isMounted,
        (hasLiked: boolean) => {
          if (isMounted()) setHasLiked(hasLiked);
        },
        user.uid
      );
      hasUserBlockedUser(
        isMounted,
        user.uid,
        comment.userID,
        setIsContentBlocked
      );
    }

    getUserBasicInfo((newBasicUserInfo: UserBasicInfo) => {
      if (isMounted()) setUserBasicInfo(newBasicUserInfo);
    }, comment.userID);

    isUserOnlineSubscribe = getIsUserOnline((isUserOnline: any) => {
      if (isMounted()) setIsUserOnline(isUserOnline.state);
    }, comment.userID);

    return () => {
      if (isUserOnlineSubscribe) off(isUserOnlineSubscribe);
    };
  }, [commentID, comment.text, comment.userID, isMounted, user]);

  if (isContentBlocked) return <div />;

  return (
    <Container
      className="x-fill column bg-white mt1"
      style={{
        borderTopLeftRadius: commentIndex === 0 ? "8px" : "",
        borderTopRightRadius: commentIndex === 0 ? "8px" : "",
        borderBottomLeftRadius: arrayLength - 1 === commentIndex ? "8px" : "",
        borderBottomRightRadius: arrayLength - 1 === commentIndex ? "8px" : "",
      }}
    >
      <Container className="justify-between py16">
        <DisplayName
          displayName={userBasicInfo?.displayName}
          isUserOnline={isUserOnline}
          userBasicInfo={userBasicInfo}
          userID={comment.userID}
        />

        <Container className="relative column full-center">
          {user && (
            <Options
              canUserInteractFunction={
                userSignUpProgress(user, true)
                  ? () => {
                      const userInteractionIssues = userSignUpProgress(user);

                      if (userInteractionIssues) {
                        if (userInteractionIssues === "NSI")
                          return setStarterModal(true);
                      }
                    }
                  : false
              }
              deleteFunction={() => {
                deleteComment(comment.id, setComments);
              }}
              editFunction={() => {
                setCommentString(comment.text);
                setEditingComment(true);
              }}
              objectID={comment.id}
              objectUserID={comment.userID}
              reportFunction={(option: any) => {
                reportComment(option, comment.id, user.uid, comment.ventID);
              }}
              userID={user.uid}
            />
          )}
        </Container>
      </Container>
      {!editingComment && <p>{swapTags(comment.text)}</p>}
      {editingComment && (
        <Container className="column x-fill align-end br8">
          {/* <Container className="relative x-fill">
            <MentionsInput
              className="mentions"
              onChange={(e) => {
                setCommentString(e.target.value);
              }}
              value={commentString}
            >
              <Mention
                className="mentions__mention"
                data={(currentTypingTag, callback) => {
                  findPossibleUsersToTag(
                    currentTypingTag,
                    comment.ventID,
                    callback
                  );
                }}
                markup="@{{[[[__id__]]]||[[[__display__]]]}}"
                renderSuggestion={(entry) => {
                  return (
                    <Container className="button-7 column pa16" key={entry.id}>
                      <h6>{entry.display}</h6>
                    </Container>
                  );
                }}
                trigger="@"
              />
            </MentionsInput>
          </Container> */}
          <Container className="mt8">
            <button
              className="button-5 px32 py8 mr8 br4"
              onClick={() => setEditingComment(false)}
            >
              Cancel
            </button>
            <button
              className="button-2 px32 py8 br4"
              onClick={() => {
                editComment(comment.id, commentString, setComments);

                setEditingComment(false);
              }}
            >
              Save
            </button>
          </Container>
        </Container>
      )}
      <Container className="align-center justify-between wrap gap8 py16">
        <Container
          className="clickable align-center"
          onClick={async (e: any) => {
            e.preventDefault();

            const userInteractionIssues = userSignUpProgress(user);

            if (userInteractionIssues) {
              if (userInteractionIssues === "NSI") setStarterModal(true);
              return;
            }

            await likeOrUnlikeComment(comment, hasLiked, user);
            await getCommentHasLiked(
              commentID,
              isMounted,
              setHasLiked,
              user.uid
            );

            if (hasLiked) comment.like_counter--;
            else comment.like_counter++;
            setComment({ ...comment });
          }}
        >
          <FontAwesomeIcon
            className={`heart ${hasLiked ? "red" : "grey-5"} mr4`}
            icon={hasLiked ? faHeart2 : faHeart}
          />
          <p className="grey-5">
            {comment.like_counter ? comment.like_counter : 0}
          </p>
        </Container>
        <Container className="align-center">
          <FontAwesomeIcon className="clickable grey-5 mr8" icon={faClock} />
          <p className="grey-5 fs-16">
            {dayjs(comment.server_timestamp).fromNow()}
          </p>
        </Container>
      </Container>

      {starterModal && (
        <StarterModal
          activeModal={starterModal}
          setActiveModal={setStarterModal}
        />
      )}
    </Container>
  );
}

export default Comment;
