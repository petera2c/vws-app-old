import React, { useEffect, useState } from "react";
import dayjs from "dayjs";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

import { urlify } from "../util";
import { deleteMessage } from "../app/conversations/util";
import UserBasicInfo from "@/types/UserBasicInfo";
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
      <div className="w-full">
        {urlify(message.body).map((obj, index) => {
          return (
            <p className="grey-11 py8" key={index}>
              {obj}
            </p>
          );
        })}
      </div>
    );
  else
    return (
      <div className="w-full">
        <div
          className={
            "br4 " + (message.userID === userID ? "bg-blue" : "bg-blue-1")
          }
          style={{ maxWidth: "80%" }}
        >
          <div className="flex flex-col grow px16 py8">
            {message.userID !== userID &&
              shouldShowDisplayName &&
              displayName && <p className="orange">{displayName}</p>}
            <div className="grow description ">
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
          </div>
          <div className="relative br4">
            <div
              className="clickable items-end pr2"
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
            </div>
            {messageOptions && (
              <div
                className="absolute top-100 left-0 pt4"
                style={{ zIndex: 1 }}
              >
                <div className="flex flex-col w-full bg-white border-all px16 py8 br8">
                  <div
                    className="button-8 clickable items-center"
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
                    <p className="grow">
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
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
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
      </div>
    );
}

export default Message;
