"use client";
import React, { useContext, useEffect, useState } from "react";
import { Button } from "antd";

import Chat from "../chat/page";
import MobileConversations from "./MobileConversations";

import { UserContext } from "../../context";

import { useIsMobileOrTablet, userSignUpProgress } from "../../util";
import {
  getConversations,
  mostRecentConversationListener,
  setInitialConversationsAndActiveConversation,
} from "./util";
import ConversationType from "@/types/ConversationType";
import Page from "@/components/containers/Page/Page";
import Link from "next/link";
import ConversationOption from "@/components/ConversationOption";
import CreateGroupChatModal from "@/components/modals/CreateGroupChat/CreateGroupChat";
import { useRecoilState } from "recoil";
import { starterModalAtom } from "@/atoms/ModalVisibility";

const Conversations = () => {
  const { user } = useContext(UserContext);

  const [, setStarterModal] = useRecoilState(starterModalAtom);

  const [activeChatUserBasicInfos, setActiveChatUserBasicInfos] = useState();
  const [activeConversation, setActiveConversation] =
    useState<ConversationType>();
  const [canLoadMore, setCanLoadMore] = useState(true);
  const [conversations, setConversations] = useState<ConversationType[]>([]);
  const [groupChatEditting, setGroupChatEditting] = useState<boolean>();
  const [isCreateGroupModalVisible, setIsCreateGroupModalVisible] =
    useState<boolean>();

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
    <Page className="bg-blue-2 overflow-hidden">
      <div className="flex grow w-full gap-1 overflow-hidden p-1">
        <div className="container small flex flex-col overflow-auto bg-white br4 p-2">
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
              <h6 className="button-1 grey-1 text-center">
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
              className="button-2 p-2 my8 br4"
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
        </div>

        <div className="flex flex-col grow overflow-hidden bg-white br4">
          {!activeConversation && user && user.emailVerified && (
            <Link className="grey-1 text-center p-8" href="/people-online">
              <h4 className="text-center">
                Check your messages from friends on Vent With Strangers,{" "}
              </h4>
              <h1 className="blue">See Who is Online :)</h1>
            </Link>
          )}
          {(!user || (user && !user.emailVerified)) && (
            <h4
              className="button-1 grey-1 text-center p-8"
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
        </div>
      </div>

      {isCreateGroupModalVisible && (
        <CreateGroupChatModal
          close={() => setIsCreateGroupModalVisible(false)}
          groupChatEditting={groupChatEditting}
        />
      )}
    </Page>
  );
};

const Temp = () => {
  const isMobileOrTablet = useIsMobileOrTablet();

  if (isMobileOrTablet) return <MobileConversations />;
  else return <Conversations />;
};

export default Temp;
