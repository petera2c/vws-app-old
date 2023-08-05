"use client";
import React, { useEffect, useRef, useState } from "react";
import { Button } from "antd";

import KarmaBadge from "../../components/views/KarmaBadge";
import Message from "../../components/Message";

import {
  capitolizeFirstChar,
  getIsMobileOrTablet,
  getUserBasicInfo,
  useIsMounted,
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
import Container from "@/components/containers/Container/Container";
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
  console.log(activeConversation);
  const isMounted = useIsMounted();
  const router = useRouter();

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
  const [isMobileOrTablet, setIsMobileOrTablet] = useState<boolean>();
  const [messages, setMessages] = useState<MessageType[]>([]);
  const [messageString, setMessageString] = useState("");
  const [showPartnerIsTyping, setShowPartnerIsTyping] = useState(false);

  useEffect(() => {
    let messageListenerUnsubscribe: any;
    let isUserTypingUnsubscribe: any;

    setIsMobileOrTablet(getIsMobileOrTablet());
    setCanLoadMore(true);
    setShowPartnerIsTyping(false);

    if (
      activeConversation &&
      activeConversation.members &&
      activeConversation.members.length >= 2
    ) {
      isUserTypingUnsubscribe = isUserTypingListener(
        activeConversation.id,
        isMounted,
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
        if (isMounted()) {
          setActiveChatUserBasicInfos(tempArray);
        }
      };
      getAllMemberData(chatMemberIDArray);
    }

    getMessages(
      activeConversation.id,
      isMounted,
      [],
      scrollToBottom,
      setCanLoadMore,
      setMessages
    );

    messageListenerUnsubscribe = messageListener(
      activeConversation.id,
      isMounted,
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
    isMounted,
    setActiveChatUserBasicInfos,
    userID,
  ]);

  return (
    <Container className="column flex-fill x-fill full-center ov-hidden br4">
      <Container className="justify-between x-fill border-bottom pa16">
        <Container
          className={
            "align-center gap4 " +
            (activeConversation.is_group ? "clickable" : "")
          }
          onClick={() => {
            if (!activeConversation.is_group) return;
            setGroupChatEditting(activeConversation);
            setIsCreateGroupModalVisible(true);
          }}
        >
          <Container className="align-end">
            {activeChatUserBasicInfos &&
              activeChatUserBasicInfos.map(
                (userBasicInfo: UserBasicInfo, index: number) => (
                  <Container
                    className="relative"
                    key={userBasicInfo.id}
                    style={{ transform: "translateX(" + index * -28 + "px)" }}
                  >
                    <MakeAvatar
                      displayName={userBasicInfo.displayName}
                      userBasicInfo={userBasicInfo}
                      size="small"
                    />
                  </Container>
                )
              )}
          </Container>

          {!activeConversation.is_group &&
            activeChatUserBasicInfos &&
            activeChatUserBasicInfos[0] && (
              <Link
                className="flex"
                href={"/profile?" + activeChatUserBasicInfos[0].id}
              >
                <h5 className="button-1 mr8">
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
        </Container>

        {isMobileOrTablet && (
          <Button
            onClick={() => {
              setActiveConversation(false);
              router.push("/chat");
            }}
          >
            Go Back
          </Button>
        )}
      </Container>

      <Container className="column x-fill flex-fill ov-hidden px16">
        {!messages ||
          ((messages && messages.length) === 0 && (
            <h4 className="tac">
              The conversation has been started but no messages have been sent!
            </h4>
          ))}

        <Container
          className={
            "column flex-fill ov-auto gap8 " + (canLoadMore ? "" : "pt8")
          }
        >
          {canLoadMore && (
            <button
              className="button-2 pa8 mb8 br4"
              onClick={() =>
                getMessages(
                  activeConversation.id,
                  isMounted,
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
        </Container>
      </Container>
      <Container
        className="ease-in-out x-fill"
        style={{
          maxHeight: showPartnerIsTyping ? "56px" : "0",
        }}
      >
        <Container className="bg-none ov-hidden full-center">
          <Container className="align-end pl16">
            {activeChatUserBasicInfos && activeChatUserBasicInfos[0] && (
              <MakeAvatar
                displayName={activeChatUserBasicInfos[0].displayName}
                userBasicInfo={activeChatUserBasicInfos[0]}
              />
            )}
            <h4>...</h4>
          </Container>
        </Container>
      </Container>
      <Container
        className="ease-in-out x-fill"
        style={{
          maxHeight: arrayOfUsersTyping.length > 0 ? "56px" : "0",
        }}
      >
        <Container className="bg-none ov-hidden full-center">
          <Container className="align-end pl16">
            <p className="">
              {arrayOfUsersTyping.length}
              {arrayOfUsersTyping.length === 1 ? " person is " : " people are "}
              typing...
            </p>
          </Container>
        </Container>
      </Container>

      <Container className="column x-fill">
        <Container
          className={
            "x-fill border-top  " +
            (isMobileOrTablet ? "" : "align-center pr16")
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
              "button-2 " + (isMobileOrTablet ? "px8 py4" : "px32 py8 br4")
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
        </Container>
      </Container>
    </Container>
  );
}

export default Chat;
