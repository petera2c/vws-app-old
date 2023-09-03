"use client";
import React, { useContext, useEffect, useState } from "react";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

import SubscribeColumn from "../../components/SubscribeColumn";

import { UserContext } from "../../context";

import {
  isUserInQueueListener,
  leaveQueue,
} from "../../components/Header/util";
import { getIsMobileOrTablet, userSignUpProgress } from "../../util";
import { joinQueue } from "./util";
import Page from "@/components/containers/Page/Page";
import { faHandsHelping } from "@fortawesome/free-solid-svg-icons";
import { useRecoilState } from "recoil";
import { starterModalAtom } from "@/atoms/ModalVisibility";

function ChatWithStrangersPage() {
  const { user } = useContext(UserContext);

  const [isMobileOrTablet, setIsMobileOrTablet] = useState<boolean>();
  const [isUserInQueue, setIsUserInQueue] = useState();
  const [, setStarterModal] = useRecoilState(starterModalAtom);

  useEffect(() => {
    setIsMobileOrTablet(getIsMobileOrTablet());

    let isUserInQueueUnsubscribe: any;

    if (user)
      isUserInQueueUnsubscribe = isUserInQueueListener(
        setIsUserInQueue,
        user.uid
      );

    return () => {
      if (isUserInQueueUnsubscribe) isUserInQueueUnsubscribe();
    };
  }, [user]);

  return (
    <Page className="pa16">
      <div className="flex">
        <div className="flex flex-col grow full-center gap-8">
          <div className="container medium flex flex-col items-center bg-white br8 pa32">
            <h1 className="text-center">Chat With Strangers</h1>
            <p className="text-center">
              This button will only connect you with someone you have no current
              conversations with :)
            </p>
          </div>
          {isUserInQueue ? (
            <div
              className="container medium flex flex-col button-6 bg-white border-all2 br8"
              onClick={() => {
                const userInteractionIssues = userSignUpProgress(user);

                if (userInteractionIssues) {
                  if (userInteractionIssues === "NSI") setStarterModal(true);
                  return;
                }

                leaveQueue(user?.uid!);
              }}
            >
              <div
                className={
                  "flex flex-col w-full grow full-center " +
                  (isMobileOrTablet ? "py32" : "py64")
                }
              >
                {/* <FontAwesomeIcon
                  className="blue mb8"
                  icon={faPersonToDoor}
                  size="2x"
                /> */}
                <h2 className="ic text-center">Leave Queue</h2>
              </div>
            </div>
          ) : (
            <div
              className="container medium flex flex-col button-6 bg-white border-all2 br8"
              onClick={() => {
                const userInteractionIssues = userSignUpProgress(user);

                if (userInteractionIssues) {
                  if (userInteractionIssues === "NSI") setStarterModal(true);
                  return;
                }

                joinQueue(user!.uid);
              }}
            >
              <div
                className={
                  "flex flex-col w-full grow full-center " +
                  (isMobileOrTablet ? "py32" : "py64")
                }
              >
                <FontAwesomeIcon
                  className="blue mb8"
                  icon={faHandsHelping}
                  size="2x"
                />
                <h2 className="ic text-center">Start Chatting</h2>
              </div>
            </div>
          )}
        </div>
        <SubscribeColumn slot="1591936277" />
      </div>
    </Page>
  );
}

export default ChatWithStrangersPage;
