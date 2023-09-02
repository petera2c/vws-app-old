import React, { useEffect, useRef, useState } from "react";
import { off } from "@firebase/database";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import { Dropdown, message } from "antd";

import KarmaBadge from "./views/KarmaBadge";

import {
  blockUser,
  capitolizeFirstChar,
  getIsUserOnline,
  getUserBasicInfo,
} from "../util";
import {
  conversationListener,
  deleteConversation,
  getIsChatMuted,
  muteChat,
  readConversation,
} from "../app/conversations/util";
import ConversationType from "@/types/ConversationType";
import { useRouter } from "next/navigation";
import UserBasicInfo from "@/types/UserBasicInfo";
import MakeAvatar from "./views/MakeAvatar";
import ConfirmAlertModal from "./modals/ConfirmAlert/ConfirmAlert";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faEllipsisV,
  faTrash,
  faUserLock,
  faVolumeDown,
  faVolumeUp,
} from "@fortawesome/free-solid-svg-icons";

dayjs.extend(relativeTime);

function ConversationOption({
  conversation,
  isActive,
  setActiveConversation,
  setActiveChatUserBasicInfos,
  setConversations,
  userID,
}: {
  conversation: ConversationType;
  isActive: boolean;
  setActiveConversation: any;
  setActiveChatUserBasicInfos: any;
  setConversations: any;
  userID: string;
}) {
  const router = useRouter();

  const unsubFromConversationUpdates: any = useRef(false);

  const [blockModal, setBlockModal] = useState(false);
  const [deleteConversationConfirm, setDeleteConversationConfirm] =
    useState(false);
  const [isMuted, setIsMuted] = useState<Boolean>();
  const [userBasicInfoArray, setUserBasicInfoArray] = useState<UserBasicInfo[]>(
    []
  );
  // @ts-ignore
  const hasSeen = conversation[userID];

  useEffect(() => {
    unsubFromConversationUpdates.current = conversationListener(
      conversation,

      setConversations
    );

    let chatMemberIDArray = [];

    for (let index in conversation.members) {
      if (conversation.members[index] !== userID)
        chatMemberIDArray.push(conversation.members[index]);
    }
    if (chatMemberIDArray.length === 0) return;

    const getAllMemberData = async (chatMemberIDArray: string[]) => {
      let tempArray: UserBasicInfo[] = [];
      for (let index in chatMemberIDArray) {
        await getUserBasicInfo((newBasicUserInfo: UserBasicInfo) => {
          tempArray.push(newBasicUserInfo);
        }, chatMemberIDArray[index]);
      }
      setUserBasicInfoArray(tempArray);

      if (isActive) setActiveChatUserBasicInfos(tempArray);
    };
    getAllMemberData(chatMemberIDArray);

    if (isActive && (!hasSeen || conversation.go_to_inbox))
      readConversation(conversation, userID);

    getIsChatMuted(conversation.id, setIsMuted, userID);

    return () => {
      if (unsubFromConversationUpdates.current)
        unsubFromConversationUpdates.current();
    };
  }, [
    conversation,
    hasSeen,
    isActive,

    setActiveChatUserBasicInfos,
    setConversations,
    userID,
  ]);

  if (!conversation) return <div>loading</div>;

  return (
    <div
      className={
        "w-full relative items-center justify-between clickable pa8 br4 " +
        (isActive ? "bg-blue-1" : "")
      }
      onClick={() => {
        setActiveChatUserBasicInfos(userBasicInfoArray);
        setActiveConversation(conversation);
        router.push("/chat?" + conversation.id);
      }}
    >
      <div className="grow flex flex-col overflow-hidden">
        <div className="items-center grow gap4 mr16">
          <div
            className="items-end"
            style={{ width: userBasicInfoArray.length * 20 + 32 + "px" }}
          >
            {userBasicInfoArray.map((userBasicInfo) => (
              <div
                className="relative"
                key={userBasicInfo.id}
                style={{
                  width: "20px",
                }}
              >
                <MakeAvatar
                  displayName={userBasicInfo.displayName}
                  userBasicInfo={userBasicInfo}
                  size="small"
                />
              </div>
            ))}
          </div>

          {(conversation.chat_name || userBasicInfoArray) && (
            <DisplayOnlineAndName
              chatName={conversation.chat_name}
              hasSeen={hasSeen}
              userBasicInfo={
                userBasicInfoArray.length > 0
                  ? userBasicInfoArray[0]
                  : undefined
              }
            />
          )}
          {!conversation.chat_name && userBasicInfoArray.length === 1 && (
            <KarmaBadge
              noOnClick
              userBasicInfo={
                userBasicInfoArray.length > 0
                  ? userBasicInfoArray[0]
                  : undefined
              }
            />
          )}
        </div>
        {conversation.last_message && (
          <p
            className="description"
            style={{
              WebkitLineClamp: 1,
              lineClamp: 1,
            }}
          >
            {conversation.last_message.length > 40
              ? conversation.last_message.substring(0, 40) + "..."
              : conversation.last_message}{" "}
          </p>
        )}
        {conversation.last_updated && (
          <p>{dayjs(conversation.last_updated).fromNow()}</p>
        )}
      </div>

      <Dropdown
        overlay={
          <div className="flex flex-col w-full bg-white border-all px16 py8 br8">
            <div
              className="button-8 clickable items-center"
              onClick={() => {
                setIsMuted(!isMuted);
                muteChat(conversation.id, userID, !isMuted);
                message.success(
                  "Chat is " + (isMuted ? "unmuted" : "muted") + " :)"
                );
              }}
            >
              <p className="grow ic">{isMuted ? "Unmute " : "Mute "}Chat</p>
              <FontAwesomeIcon
                className="ml8"
                icon={isMuted ? faVolumeDown : faVolumeUp}
              />
            </div>
            <div
              className="button-8 clickable items-center"
              onClick={() => {
                setBlockModal(!blockModal);
              }}
            >
              <p className="ic fw-400 grow">Block User</p>
              <FontAwesomeIcon className="ml8" icon={faUserLock} />
            </div>
            <div
              className="button-9 clickable items-center"
              onClick={() => {
                setDeleteConversationConfirm(true);
              }}
            >
              <p className="grow ic">Leave Chat</p>
              <FontAwesomeIcon className="ml8" icon={faTrash} />
            </div>
          </div>
        }
        placement="bottomRight"
        trigger={["click"]}
      >
        <div className="clickable px8">
          <FontAwesomeIcon className="grey-9" icon={faEllipsisV} />
        </div>
      </Dropdown>
      {deleteConversationConfirm && (
        <ConfirmAlertModal
          close={() => setDeleteConversationConfirm(false)}
          message="Deleting this conversation will be permanent. Are you sure you would like to delete this conversation?"
          submit={() => {
            if (unsubFromConversationUpdates.current)
              unsubFromConversationUpdates.current();

            deleteConversation(
              conversation.id,
              router,
              setActiveConversation,
              setConversations,
              userID
            );
          }}
          title="Delete Conversation"
        />
      )}
      {blockModal && (
        <ConfirmAlertModal
          close={() => setBlockModal(false)}
          message="Blocking this user will remove you from all conversations with this user and you will no longer see any of their vents or comments. Are you sure you would like to block this user?"
          submit={() => {
            blockUser(
              userID,
              conversation.members.find((memberID: string) => {
                if (memberID !== userID) return memberID;
                else return undefined;
              })
            );
          }}
          title="Block User"
        />
      )}
    </div>
  );
}

function DisplayOnlineAndName({
  chatName,
  hasSeen,
  style,
  userBasicInfo,
}: {
  chatName: string;
  hasSeen: boolean;
  style?: any;
  userBasicInfo?: UserBasicInfo;
}) {
  const [isUserOnline, setIsUserOnline] = useState(false);

  useEffect(() => {
    let isUserOnlineSubscribe: any;

    if (!chatName)
      isUserOnlineSubscribe = getIsUserOnline((isUserOnlineObj: any) => {
        if (isUserOnlineObj && isUserOnlineObj.state) {
          if (isUserOnlineObj.state === "online") setIsUserOnline(true);
          else setIsUserOnline(false);
        }
      }, userBasicInfo?.id);

    return () => {
      if (isUserOnlineSubscribe) off(isUserOnlineSubscribe);
    };
  }, [chatName, userBasicInfo]);

  return (
    <div className="grow items-center overflow-hidden gap8" style={style}>
      <h6 className={"ellipsis " + (hasSeen ? "grey-1" : "primary")}>
        {chatName
          ? chatName
          : userBasicInfo
          ? capitolizeFirstChar(userBasicInfo.displayName)
          : "Anonymous"}
      </h6>
      {!chatName && isUserOnline && <div className="online-dot" />}
    </div>
  );
}

export default ConversationOption;
