"use client";
import React, { useContext, useEffect, useState } from "react";
import { Button } from "antd";

import Chat from "../chat/page";
import MobileIndex from "./MobileConversations";
import StarterModal from "../../components/modals/Starter";

import { UserContext } from "../../context";

import { getIsMobileOrTablet, userSignUpProgress } from "../../util";
import {
  getConversations,
  mostRecentConversationListener,
  setInitialConversationsAndActiveConversation,
} from "./util";
import ConversationType from "@/types/ConversationType";
import Page from "@/components/containers/Page/Page";
import Container from "@/components/containers/Container/Container";
import Link from "next/link";
import ConversationOption from "@/components/ConversationOption";
import CreateGroupChatModal from "@/components/modals/CreateGroupChat/CreateGroupChat";

function Conversations() {
  const { user } = useContext(UserContext);

  const [activeChatUserBasicInfos, setActiveChatUserBasicInfos] = useState();
  const [activeConversation, setActiveConversation] =
    useState<ConversationType>();
  const [canLoadMore, setCanLoadMore] = useState(true);
  const [conversations, setConversations] = useState<ConversationType[]>([]);
  const [groupChatEditting, setGroupChatEditting] = useState<boolean>();
  const [isCreateGroupModalVisible, setIsCreateGroupModalVisible] =
    useState<boolean>();
  const [starterModal, setStarterModal] = useState(!user);

  useEffect(() => {
    let newMessageListenerUnsubscribe: any;

    if (user) {
      setStarterModal(false);
      newMessageListenerUnsubscribe = mostRecentConversationListener(
        setConversations,
        user.uid
      );

      getConversations(
        [],
        (newConversations: ConversationType[]) =>
          setInitialConversationsAndActiveConversation(
            newConversations,
            true,
            setActiveConversation,
            setCanLoadMore,
            setConversations
          ),
        user.uid
      );
    }

    return () => {
      if (newMessageListenerUnsubscribe) newMessageListenerUnsubscribe();
    };
  }, [user]);

  return (
    <Page className="bg-blue-2 ov-hidden">
      <Container className="flex-fill x-fill gap4 ov-hidden pa4">
        <Container className="container small column ov-auto bg-white br4 pa8">
          {user && user.emailVerified && (
            <Button
              className="mb8"
              onClick={() => {
                setGroupChatEditting(false);
                setIsCreateGroupModalVisible(true);
              }}
              size="large"
              type="primary"
            >
              New Group Chat
            </Button>
          )}
          {conversations.length === 0 && (
            <Link className="" href="/people-online">
              <h6 className="button-1 grey-1 tac">
                Start a conversation with someone!
              </h6>
            </Link>
          )}

          {user &&
            conversations.map((conversation: ConversationType) => {
              return (
                <ConversationOption
                  conversation={conversation}
                  isActive={
                    activeConversation
                      ? conversation.id === activeConversation.id
                      : false
                  }
                  key={conversation.id}
                  setActiveChatUserBasicInfos={setActiveChatUserBasicInfos}
                  setActiveConversation={setActiveConversation}
                  setConversations={setConversations}
                  userID={user.uid}
                />
              );
            })}
          {!userSignUpProgress(user, true) && canLoadMore && (
            <button
              className="button-2 pa8 my8 br4"
              onClick={() => {
                getConversations(
                  conversations,
                  (newConversations: ConversationType[]) => {
                    if (newConversations.length < 5) setCanLoadMore(false);

                    setConversations((oldConversations: ConversationType[]) => [
                      ...oldConversations,
                      ...newConversations,
                    ]);
                  },
                  user?.uid
                );
              }}
            >
              Load More Conversations
            </button>
          )}
        </Container>

        <Container className="column flex-fill ov-hidden bg-white br4">
          {!activeConversation && user && user.emailVerified && (
            <Link className="grey-1 tac pa32" href="/people-online">
              <h4 className="tac">
                Check your messages from friends on Vent With Strangers,{" "}
              </h4>
              <h1 className="blue">See Who is Online :)</h1>
            </Link>
          )}
          {(!user || (user && !user.emailVerified)) && (
            <h4
              className="button-1 grey-1 tac pa32"
              onClick={() => {
                if (!user) setStarterModal(true);
                else {
                  userSignUpProgress(user);
                }
              }}
            >
              Check your messages from friends on Vent With Strangers,
              <span className="blue">
                {user ? " verify your email!" : " get started here!"}
              </span>
            </h4>
          )}
          {user &&
            user.emailVerified &&
            activeConversation &&
            activeConversation.id && (
              <Chat
                activeConversation={activeConversation}
                activeChatUserBasicInfos={activeChatUserBasicInfos}
                isChatInConversationsArray={Boolean(
                  conversations.find(
                    (conversation) => conversation.id === activeConversation.id
                  )
                )}
                setActiveConversation={setActiveConversation}
                setActiveChatUserBasicInfos={setActiveChatUserBasicInfos}
                setGroupChatEditting={setGroupChatEditting}
                setIsCreateGroupModalVisible={setIsCreateGroupModalVisible}
                userID={user.uid}
              />
            )}
        </Container>
      </Container>
      {starterModal && (
        <StarterModal
          activeModal={starterModal}
          setActiveModal={setStarterModal}
        />
      )}
      {isCreateGroupModalVisible && (
        <CreateGroupChatModal
          close={() => setIsCreateGroupModalVisible(false)}
          groupChatEditting={groupChatEditting}
        />
      )}
    </Page>
  );
}

let temp;

if (!getIsMobileOrTablet()) temp = Conversations;
else temp = MobileIndex;

export default temp;
