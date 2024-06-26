import React, { useContext, useEffect, useState } from "react";
import { off } from "@firebase/database";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";

import { faHeart } from "@fortawesome/free-regular-svg-icons/faHeart";
import { faHeart as faHeart2 } from "@fortawesome/free-solid-svg-icons/faHeart";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

import DisplayName from "../views/DisplayName";
import Options from "../Options";

import { UserContext } from "../../context";

import {
  getIsUserOnline,
  getUserBasicInfo,
  hasUserBlockedUser,
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
} from "./util";
import UserBasicInfo from "@/types/UserBasicInfo";
import { faClock } from "@fortawesome/free-solid-svg-icons";
import { useRecoilState } from "recoil";
import { starterModalAtom } from "@/atoms/ModalVisibility";
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
  setComments?: any;
}) {
  const { user } = useContext(UserContext);
  const [, setStarterModal] = useRecoilState(starterModalAtom);

  const [comment, setComment] = useState(comment2);
  const [commentString, setCommentString] = useState("");
  const [editingComment, setEditingComment] = useState(false);
  const [hasLiked, setHasLiked] = useState(false);
  const [isContentBlocked, setIsContentBlocked] = useState(user ? true : false);
  const [isUserOnline, setIsUserOnline] = useState(false);
  const [userBasicInfo, setUserBasicInfo] = useState<UserBasicInfo>();

  useEffect(() => {
    let isUserOnlineSubscribe: any;

    if (user) {
      getCommentHasLiked(
        commentID,

        (hasLiked: boolean) => {
          setHasLiked(hasLiked);
        },
        user.uid
      );
      hasUserBlockedUser(user.uid, comment.userID, setIsContentBlocked);
    }

    getUserBasicInfo((newBasicUserInfo: UserBasicInfo) => {
      setUserBasicInfo(newBasicUserInfo);
    }, comment.userID);

    isUserOnlineSubscribe = getIsUserOnline((isUserOnline: any) => {
      setIsUserOnline(isUserOnline.state);
    }, comment.userID);

    return () => {
      if (isUserOnlineSubscribe) off(isUserOnlineSubscribe);
    };
  }, [commentID, comment.text, comment.userID, user]);

  if (isContentBlocked) return <div />;

  return (
    <div
      className="w-full flex flex-col bg-white mt1"
      style={{
        borderTopLeftRadius: commentIndex === 0 ? "8px" : "",
        borderTopRightRadius: commentIndex === 0 ? "8px" : "",
        borderBottomLeftRadius: arrayLength - 1 === commentIndex ? "8px" : "",
        borderBottomRightRadius: arrayLength - 1 === commentIndex ? "8px" : "",
      }}
    >
      <div className="justify-between py-4">
        <DisplayName
          displayName={userBasicInfo?.displayName}
          isUserOnline={isUserOnline}
          userBasicInfo={userBasicInfo}
          userID={comment.userID}
        />

        <div className="relative flex flex-col full-center">
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
        </div>
      </div>
      {!editingComment && <p>{swapTags(comment.text)}</p>}
      {editingComment && (
        <div className="flex flex-col w-full items-end br8">
          {/* <div className="relative w-full">
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
                    <div className="button-7 flex flex-col p-4" key={entry.id}>
                      <h6>{entry.display}</h6>
                    </div>
                  );
                }}
                trigger="@"
              />
            </MentionsInput>
          </div> */}
          <div className="mt8">
            <button
              className="button-5 px-8 py-2 mr-2 br4"
              onClick={() => setEditingComment(false)}
            >
              Cancel
            </button>
            <button
              className="button-2 px-8 py-2 br4"
              onClick={() => {
                editComment(comment.id, commentString, setComments);

                setEditingComment(false);
              }}
            >
              Save
            </button>
          </div>
        </div>
      )}
      <div className="flex items-center justify-between flex-wrap gap-2 py-4">
        <div
          className="flex items-center cursor-pointer"
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

              setHasLiked,
              user?.uid
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
        </div>
        <div className="items-center">
          <FontAwesomeIcon
            className="cursor-pointer grey-5 mr-2"
            icon={faClock}
          />
          <p className="grey-5 fs-16">
            {dayjs(comment.server_timestamp).fromNow()}
          </p>
        </div>
      </div>
    </div>
  );
}

export default Comment;
