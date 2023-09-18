"use client";
import React, { useEffect, useRef, useState } from "react";
import { Button } from "antd";

import KarmaBadge from "../../components/views/KarmaBadge";
import Message from "../../components/Message";

import {
  capitolizeFirstChar,
  getUserBasicInfo,
  useIsMobileOrTablet,
} from "../../util";
import {
  getConversationPartnerUserID,
  getMessages,
  isUserTypingListener,
  messageListener,
  sendMessage,
  setConversationIsTyping,
} from "../conversations/util";
import { useRouter } from "next/navigation";
import UserBasicInfo from "@/types/UserBasicInfo";
import { off } from "@firebase/database";
import MakeAvatar from "@/components/views/MakeAvatar";
import Link from "next/link";
import MessageType from "@/types/MessageType";
import Emoji from "@/components/Emoji/Emoji";
import ConversationType from "@/types/ConversationType";

let typingTimer: any;

function Chat({
  activeChatUserBasicInfos,
  activeConversation,
  isChatInConversationsArray,
  setActiveChatUserBasicInfos,
  setActiveConversation,
  setGroupChatEditting,
  setIsCreateGroupModalVisible,
  userID,
}: {
  activeChatUserBasicInfos: any;
  activeConversation: ConversationType;
  isChatInConversationsArray: any;
  setActiveChatUserBasicInfos: any;
  setActiveConversation?: any;
  setGroupChatEditting?: any;
  setIsCreateGroupModalVisible?: any;
  userID: any;
}) {
  const router = useRouter();

  const isMobileOrTablet = useIsMobileOrTablet();

  const dummyRef = useRef<any>();
  const textInput = useRef(null);
  const isUserTypingTimeout = useRef();

  const scrollToBottom = () => {
    if (dummyRef.current)
      // @ts-ignore
      dummyRef.current.scrollIntoView({
        block: "nearest",
        inline: "center",
        behavior: "smooth",
        alignToTop: false,
      });
  };

  const [allowToSetIsUserTypingToDB, setAllowToSetIsUserTypingToDB] =
    useState(true);
  const [arrayOfUsersTyping, setArrayOfUsersTyping] = useState([]);
  const [canLoadMore, setCanLoadMore] = useState(true);
  const [messages, setMessages] = useState<MessageType[]>([]);
  const [messageString, setMessageString] = useState("");
  const [showPartnerIsTyping, setShowPartnerIsTyping] = useState(false);

  useEffect(() => {
    let messageListenerUnsubscribe: any;
    let isUserTypingUnsubscribe: any;

    setCanLoadMore(true);
    setShowPartnerIsTyping(false);

    if (
      activeConversation &&
      activeConversation.members &&
      activeConversation.members.length >= 2
    ) {
      isUserTypingUnsubscribe = isUserTypingListener(
        activeConversation.id,
        isUserTypingTimeout,
        getConversationPartnerUserID(activeConversation.members, userID),
        scrollToBottom,
        setArrayOfUsersTyping,
        setShowPartnerIsTyping,
        userID
      );

      let chatMemberIDArray = [];

      for (let index in activeConversation.members) {
        if (activeConversation.members[index] !== userID)
          chatMemberIDArray.push(activeConversation.members[index]);
      }
      const getAllMemberData = async (chatMemberIDArray: any) => {
        let tempArray: any = [];
        for (let index in chatMemberIDArray) {
          await getUserBasicInfo((newBasicUserInfo: UserBasicInfo) => {
            tempArray.push(newBasicUserInfo);
          }, chatMemberIDArray[index]);
        }
        setActiveChatUserBasicInfos(tempArray);
      };
      getAllMemberData(chatMemberIDArray);
    }

    getMessages(
      activeConversation.id,
      [],
      scrollToBottom,
      setCanLoadMore,
      setMessages
    );

    messageListenerUnsubscribe = messageListener(
      activeConversation.id,
      scrollToBottom,
      setMessages
    );

    return () => {
      if (isUserTypingUnsubscribe) off(isUserTypingUnsubscribe);

      if (messageListenerUnsubscribe) messageListenerUnsubscribe();
    };
  }, [
    activeConversation,
    isChatInConversationsArray,
    setActiveChatUserBasicInfos,
    userID,
  ]);

  console.log(activeConversation);

  return (
    <div className="flex flex-col grow w-full full-center overflow-hidden br4">
      <div className="justify-between w-full border-bottom p-4">
        <div
          className={
            "flex items-center gap-1 " +
            (activeConversation.is_group ? "cursor-pointer" : "")
          }
          onClick={() => {
            if (!activeConversation.is_group) return;
            setGroupChatEditting(activeConversation);
            setIsCreateGroupModalVisible(true);
          }}
        >
          <div className="items-end">
            {activeChatUserBasicInfos &&
              activeChatUserBasicInfos.map(
                (userBasicInfo: UserBasicInfo, index: number) => (
                  <div
                    className="relative"
                    key={userBasicInfo.id}
                    style={{ transform: "translateX(" + index * -28 + "px)" }}
                  >
                    <MakeAvatar
                      displayName={userBasicInfo.displayName}
                      userBasicInfo={userBasicInfo}
                      size="small"
                    />
                  </div>
                )
              )}
          </div>

          {!activeConversation.is_group &&
            activeChatUserBasicInfos &&
            activeChatUserBasicInfos[0] && (
              <Link
                className="flex"
                href={"/profile?" + activeChatUserBasicInfos[0].id}
              >
                <h5 className="button-1 mr-2">
                  {capitolizeFirstChar(activeChatUserBasicInfos[0].displayName)}
                </h5>

                <KarmaBadge
                  noOnClick
                  userBasicInfo={activeChatUserBasicInfos[0]}
                />
              </Link>
            )}
          {activeConversation.is_group && (
            <h5
              className="button-1"
              style={{
                transform:
                  activeChatUserBasicInfos &&
                  activeChatUserBasicInfos.length > 1
                    ? "translateX(-" +
                      (activeChatUserBasicInfos.length - 1) * 28 +
                      "px)"
                    : "",
              }}
            >
              {activeConversation?.chat_name}
            </h5>
          )}
        </div>

        {isMobileOrTablet && (
          <Button
            onClick={() => {
              setActiveConversation(false);
              router.push("/conversations");
            }}
          >
            Go Back
          </Button>
        )}
      </div>

      <div className="flex flex-col w-full grow overflow-hidden px-4">
        {!messages ||
          ((messages && messages.length) === 0 && (
            <h4 className="text-center">
              The conversation has been started but no messages have been sent!
            </h4>
          ))}

        <div
          className={
            "flex flex-col grow overflow-auto gap-2 " +
            (canLoadMore ? "" : "pt-2")
          }
        >
          {canLoadMore && (
            <button
              className="button-2 p-2 mb8 br4"
              onClick={() =>
                getMessages(
                  activeConversation.id,
                  messages,
                  scrollToBottom,
                  setCanLoadMore,
                  setMessages,
                  false
                )
              }
            >
              Load More Messages
            </button>
          )}
          {messages.map((message, index) => {
            let shouldShowDisplayName = false;

            if (activeChatUserBasicInfos && activeChatUserBasicInfos.length > 1)
              shouldShowDisplayName = true;

            if (
              messages[index - 1] &&
              messages[index - 1].userID === message.userID
            )
              shouldShowDisplayName = false;

            return (
              <Message
                activeConversationID={activeConversation.id}
                activeChatUserBasicInfos={activeChatUserBasicInfos}
                key={index}
                message={message}
                setMessages={setMessages}
                shouldShowDisplayName={shouldShowDisplayName}
                userID={userID}
              />
            );
          })}
          <div ref={dummyRef} />
        </div>
      </div>
      <div
        className="ease-in-out w-full"
        style={{
          maxHeight: showPartnerIsTyping ? "56px" : "0",
        }}
      >
        <div className="bg-none overflow-hidden full-center">
          <div className="items-end pl-4">
            {activeChatUserBasicInfos && activeChatUserBasicInfos[0] && (
              <MakeAvatar
                displayName={activeChatUserBasicInfos[0].displayName}
                userBasicInfo={activeChatUserBasicInfos[0]}
              />
            )}
            <h4>...</h4>
          </div>
        </div>
      </div>
      <div
        className="ease-in-out w-full"
        style={{
          maxHeight: arrayOfUsersTyping.length > 0 ? "56px" : "0",
        }}
      >
        <div className="bg-none overflow-hidden full-center">
          <div className="items-end pl-4">
            <p className="">
              {arrayOfUsersTyping.length}
              {arrayOfUsersTyping.length === 1 ? " person is " : " people are "}
              typing...
            </p>
          </div>
        </div>
      </div>

      <div className="flex flex-col w-full">
        <div
          className={
            "w-full border-top  " +
            (isMobileOrTablet ? "" : "items-center pr-4")
          }
        >
          <textarea
            autoFocus
            className="send-message-textarea light-scrollbar"
            onChange={(event) => {
              if (event.target.value === "\n") return;
              setMessageString(event.target.value);

              if (!allowToSetIsUserTypingToDB) {
                if (!typingTimer) {
                  typingTimer = setTimeout(() => {
                    setAllowToSetIsUserTypingToDB(true);

                    if (typingTimer) typingTimer = undefined;
                  }, 500);
                }
              } else {
                setConversationIsTyping(
                  activeConversation.id,
                  undefined,
                  userID
                );
                setAllowToSetIsUserTypingToDB(false);
              }
            }}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                if (!messageString) return;
                setConversationIsTyping(activeConversation.id, true, userID);
                setAllowToSetIsUserTypingToDB(true);
                sendMessage(activeConversation.id, messageString, userID);
                setMessageString("");
              }
            }}
            placeholder="Type a helpful message here..."
            ref={textInput}
            value={messageString}
            rows={1}
          />
          <Emoji
            handleChange={(emoji) => {
              setMessageString(messageString + emoji);
              // @ts-ignore
              textInput?.current?.focus();
            }}
            top
          />
          <button
            className={
              "button-2 " + (isMobileOrTablet ? "px-2 py-1" : "px-8 py-2 br4")
            }
            onClick={() => {
              if (!messageString) return;
              setConversationIsTyping(activeConversation.id, true, userID);
              setAllowToSetIsUserTypingToDB(true);
              sendMessage(activeConversation.id, messageString, userID);
              setMessageString("");
            }}
          >
            Send
          </button>
        </div>
      </div>
    </div>
  );
}

export default Chat;
