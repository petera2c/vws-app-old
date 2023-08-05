import React, { useEffect, useState } from "react";
import dayjs from "dayjs";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

import { urlify } from "../util";
import { deleteMessage } from "../app/conversations/util";
import UserBasicInfo from "@/types/UserBasicInfo";
import Container from "./containers/Container/Container";
import {
  faExclamationTriangle,
  faTrash,
} from "@fortawesome/free-solid-svg-icons";
import ConfirmAlertModal from "./modals/ConfirmAlert/ConfirmAlert";

function Message({
  activeChatUserBasicInfos,
  activeConversationID,
  message,
  setMessages,
  shouldShowDisplayName,
  userID,
}: any) {
  const [deleteMessageConfirm, setDeleteMessageConfirm] = useState(false);
  const [displayName, setDisplayName] = useState("");
  const [messageOptions, setMessageOptions] = useState(false);
  const [reportModal, setReportModal] = useState(false);

  useEffect(() => {
    if (
      activeChatUserBasicInfos &&
      activeChatUserBasicInfos.find(
        (userBasicInfo: UserBasicInfo) => userBasicInfo.id === message.userID
      )
    )
      setDisplayName(
        activeChatUserBasicInfos.find(
          (userBasicInfo: UserBasicInfo) => userBasicInfo.id === message.userID
        ).displayName
      );
  }, [activeChatUserBasicInfos, message]);

  if (message.is_notice)
    return (
      <Container className="x-fill">
        {urlify(message.body).map((obj, index) => {
          return (
            <p className="grey-11 py8" key={index}>
              {obj}
            </p>
          );
        })}
      </Container>
    );
  else
    return (
      <Container className="x-fill">
        <Container
          className={
            "br4 " + (message.userID === userID ? "bg-blue" : "bg-blue-1")
          }
          style={{ maxWidth: "80%" }}
        >
          <Container className="column flex-fill px16 py8">
            {message.userID !== userID &&
              shouldShowDisplayName &&
              displayName && <p className="orange">{displayName}</p>}
            <div className="flex-fill description ">
              {urlify(message.body).map((obj, index) => {
                return (
                  <p
                    className={
                      "description " +
                      (message.userID === userID ? "white" : "primary")
                    }
                    key={index}
                  >
                    {obj}
                  </p>
                );
              })}
            </div>
          </Container>
          <Container className="relative br4">
            <Container
              className="clickable align-end pr2"
              onClick={() => {
                setMessageOptions(!messageOptions);
              }}
              // @ts-ignore
              onMouseLeave={() => setMessageOptions(false)}
            >
              <p
                className={
                  "fs-12 " + (message.userID === userID ? "white" : "grey-1")
                }
              >
                {dayjs(message.server_timestamp).format("h:mm A")}
              </p>
            </Container>
            {messageOptions && (
              <div
                className="absolute top-100 left-0 pt4"
                style={{ zIndex: 1 }}
              >
                <Container className="column x-fill bg-white border-all px16 py8 br8">
                  <Container
                    className="button-8 clickable align-center"
                    onClick={(e: any) => {
                      e.preventDefault();
                      if (message.userID === userID) {
                        setDeleteMessageConfirm(true);
                        setMessageOptions(false);
                      } else {
                        setReportModal(!reportModal);
                      }
                    }}
                  >
                    <p className="flex-fill">
                      {message.userID === userID
                        ? "Delete Message"
                        : "Report Message"}
                    </p>
                    <FontAwesomeIcon
                      className="ml8"
                      icon={
                        message.userID === userID
                          ? faTrash
                          : faExclamationTriangle
                      }
                    />
                  </Container>
                </Container>
              </div>
            )}
          </Container>
        </Container>
        {deleteMessageConfirm && (
          <ConfirmAlertModal
            close={() => setDeleteMessageConfirm(false)}
            message="Are you sure you would like to delete this message?"
            submit={() =>
              deleteMessage(activeConversationID, message.id, setMessages)
            }
            title="Delete Message"
          />
        )}
      </Container>
    );
}

export default Message;
