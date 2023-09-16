import React, { useState } from "react";
import { Dropdown } from "antd";

import { faEdit } from "@fortawesome/free-solid-svg-icons/faEdit";
import { faEllipsisV } from "@fortawesome/free-solid-svg-icons/faEllipsisV";
import { faExclamationTriangle } from "@fortawesome/free-solid-svg-icons/faExclamationTriangle";
import { faTrash } from "@fortawesome/free-solid-svg-icons/faTrash";
import { faUserLock } from "@fortawesome/free-solid-svg-icons/faUserLock";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

import ReportModal from "./modals/Report";

import { blockUser } from "../util";
import ConfirmAlertModal from "./modals/ConfirmAlert/ConfirmAlert";

const OptionsComponent = ({
  canUserInteractFunction,
  deleteFunction,
  editFunction,
  objectID,
  objectUserID,
  reportFunction,
  userID,
}: any) => {
  const [blockModal, setBlockModal] = useState<boolean>();
  const [reportModal, setReportModal] = useState<boolean>();

  return (
    <div
      onClick={(e: any) => {
        e.preventDefault();
        e.stopPropagation();
      }}
    >
      <Dropdown
        overlay={
          <div className="flex flex-col bg-white shadow-2 br8 gap-2 p-4">
            {objectUserID === userID && (
              <div
                className="button-8 cursor-pointer items-center justify-between gap-2"
                onClick={(e: any) => {
                  e.preventDefault();
                  editFunction(objectID);
                }}
              >
                <p className="ic">Edit</p>
                <FontAwesomeIcon icon={faEdit} />
              </div>
            )}
            {objectUserID === userID && (
              <div
                className="button-8 cursor-pointer items-center justify-between gap-2"
                onClick={(e: any) => {
                  e.preventDefault();
                  deleteFunction(objectID);
                }}
              >
                <p className="ic">Delete</p>
                <FontAwesomeIcon icon={faTrash} />
              </div>
            )}
            {objectUserID !== userID && (
              <div
                className="button-8 cursor-pointer items-center justify-between gap-2"
                onClick={(e: any) => {
                  e.preventDefault();
                  if (canUserInteractFunction) return canUserInteractFunction();

                  setReportModal(!reportModal);
                }}
              >
                <p className="ic">Report</p>
                <FontAwesomeIcon icon={faExclamationTriangle} />
              </div>
            )}
            {objectUserID !== userID && (
              <div
                className="button-8 cursor-pointer items-center justify-between gap-2"
                onClick={(e: any) => {
                  e.preventDefault();
                  if (canUserInteractFunction) return canUserInteractFunction();

                  setBlockModal(!blockModal);
                }}
              >
                <p className="ic">Block User</p>
                <FontAwesomeIcon icon={faUserLock} />
              </div>
            )}
          </div>
        }
        placement="bottomRight"
        trigger={["click"]}
      >
        <div className="cursor-pointer p-4">
          <FontAwesomeIcon className="grey-9" icon={faEllipsisV} />
        </div>
      </Dropdown>

      {reportModal && (
        <ReportModal
          close={() => setReportModal(false)}
          submit={(option: any) => {
            if (canUserInteractFunction) return canUserInteractFunction();

            reportFunction(option);
          }}
        />
      )}
      {blockModal && (
        <ConfirmAlertModal
          close={() => setBlockModal(false)}
          message="Blocking this user will remove you from all conversations with this user and you will no longer see any of their content. Are you sure you would like to block this user?"
          submit={() => {
            if (canUserInteractFunction) return canUserInteractFunction();

            blockUser(userID, objectUserID);
          }}
          title="Block User"
        />
      )}
    </div>
  );
};

export default OptionsComponent;
