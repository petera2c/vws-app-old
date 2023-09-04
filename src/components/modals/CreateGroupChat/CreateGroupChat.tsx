import React, { useContext, useEffect, useState } from "react";
import { off } from "@firebase/database";
import { Divider, Input, Modal, message } from "antd";

import KarmaBadge from "../../views/KarmaBadge";

import { UserContext } from "../../../context";

import { getIsUserOnline, getUserBasicInfo } from "../../../util";
import { saveGroup } from "./util";
import UserBasicInfo from "@/types/UserBasicInfo";
import MakeAvatar from "@/components/views/MakeAvatar";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTimes } from "@fortawesome/free-solid-svg-icons";

const GROUP_MAX = 5;

function GroupChatCreateModal({ close, groupChatEditting }: any) {
  const userContext = useContext(UserContext);
  const userBasicInfo = userContext?.userBasicInfo;

  const [chatNameString, setChatNameString] = useState(
    groupChatEditting && groupChatEditting.chat_name
      ? groupChatEditting.chat_name
      : ""
  );
  const [existingUsers, setExistingUsers] = useState<UserBasicInfo[]>([]);
  const [users, setUsers] = useState(groupChatEditting ? [] : [userBasicInfo]);
  const [hits, setHits] = useState([]);
  const [userSearchString, setUserSearchString] = useState("");

  useEffect(() => {
    setExistingUsers([]);

    if (groupChatEditting && groupChatEditting.members) {
      for (let index in groupChatEditting.members) {
        getUserBasicInfo((userBasicInfo: UserBasicInfo) => {
          setExistingUsers((existingUsers) => {
            existingUsers.push(userBasicInfo);
            return [...existingUsers];
          });
        }, groupChatEditting.members[index]);
      }
    }
  }, [groupChatEditting]);

  const isNewGroupChatOrOwner =
    !groupChatEditting ||
    (groupChatEditting && groupChatEditting.group_owner === userBasicInfo?.id);

  return (
    <Modal className="full-center normal-cursor">
      <div className="container large flex flex-col bg-white br4">
        <div className="w-full justify-center bg-grey-10 py16">
          <h4 className="grey-11 text-center">
            {groupChatEditting
              ? groupChatEditting.chat_name
              : "Create New Group Chat"}
          </h4>
        </div>
        <div className="flex flex-col grow overflow-auto py16 px32">
          {existingUsers && existingUsers.length > 0 && (
            <div className="flex flex-col gap-4">
              <h4>Users In Chat</h4>
              {existingUsers.map((user) => {
                return (
                  <DisplayExistingUser
                    groupChatEditting={groupChatEditting}
                    key={user.id}
                    setExistingUsers={setExistingUsers}
                    user={user}
                    userBasicInfo={userBasicInfo}
                  />
                );
              })}
            </div>
          )}

          {groupChatEditting &&
            groupChatEditting.group_owner === userBasicInfo?.id && <Divider />}

          {isNewGroupChatOrOwner && (
            <div className="flex flex-col gap-4">
              <h4>Change Chat Name or Add Users</h4>
              <Input
                onChange={(e) => {
                  setChatNameString(e.target.value);
                }}
                placeholder="Chat Name"
                value={chatNameString}
              />
              {/* <Input
                onChange={(e) => {
                  setUserSearchString(e.target.value);
                  usersIndex
                    .search(e.target.value, {
                      hitsPerPage: 10,
                    })
                    .then(({ hits }) => {
                      setHits(hits);
                    });
                }}
                placeholder="Search for people to add by name or their ID"
                value={userSearchString}
              /> */}
              {/* {hits.length > 0 && (
                <div className="flex flex-col gap-4">
                  <h4>Search Results</h4>
                  <div className="flex-wrap gap-2">
                    {hits.map((hit) => {
                      if (
                        users.find((user) => user.id === hit.objectID) ||
                        existingUsers.find((user) => user.id === hit.objectID)
                      ) {
                        return (
                          <div
                            key={hit.objectID + "s"}
                            style={{ display: "none" }}
                          />
                        );
                      } else
                        return (
                          <HitDisplay
                            existingUsers={existingUsers}
                            hit={hit}
                            key={hit.objectID}
                            setUsers={setUsers}
                          />
                        );
                    })}
                  </div>
                </div>
              )} */}
              {/* {users.length > 0 && (
                <div className="flex flex-col gap-4">
                  <h4>Selected People</h4>
                  <div
                    className="flex items-start flex-wrap gap-2"
                    style={{ maxHeight: "100px" }}
                  >
                    {users.map((user:any) => {
                      return (
                        <button
                          className="button-2 br4 gap-2 pa8"
                          key={user.id}
                          onClick={() => {
                            if (user.id === userBasicInfo?.id) {
                              return message.error(
                                "You can not remove yourself."
                              );
                            }

                            setUsers((users) => {
                              users.splice(
                                users.findIndex(
                                  (user2) => user2.id === user.id
                                ),
                                1
                              );
                              return [...users];
                            });
                          }}
                        >
                          <div className="gap-1">
                            <MakeAvatar
                              className=""
                              displayName={user.displayName}
                              size="small"
                              userBasicInfo={user}
                            />
                            <div className="full-center grow overflow-hidden ic">
                              <h5 className="ic ellipsis fw-400 grey-11">
                                {user.displayName}
                              </h5>
                            </div>
                          </div>
                          <KarmaBadge
                            noOnClick={true}
                            noTooltip={true}
                            userBasicInfo={user}
                          />
                          <FontAwesomeIcon icon={faTimes} />
                        </button>
                      );
                    })}
                  </div>
                </div>
              )} */}
            </div>
          )}
        </div>
        {isNewGroupChatOrOwner && (
          <div className="full-center border-top pa16">
            <button
              className="grey-1 border-all py8 px32 mx4 br4"
              onClick={() => close()}
            >
              Cancel
            </button>
            <button
              className="button-2 py8 px32 mx4 br4"
              onClick={() => {
                // saveGroup(
                //   chatNameString,
                //   existingUsers,
                //   groupChatEditting,
                //   userBasicInfo.id,
                //   users
                // );
                close();
              }}
            >
              Save
            </button>
          </div>
        )}
      </div>
      <div className="modal-background" onClick={close} />
    </Modal>
  );
}

// function HitDisplay({ existingUsers, hit, setUsers }) {
//
//   const [userBasicInfo, setUserBasicInfo] = useState();

//   useEffect(() => {
//     getUserBasicInfo((userBasicInfo) => {
//        setUserBasicInfo(userBasicInfo);
//     }, hit.objectID);
//   }, [hit, setUserBasicInfo]);

//   return (
//     <div
//       className="button-8 items-center gap-2"
//       onClick={() => {
//         setUsers((users) => {
//           if (existingUsers.length + users.length >= GROUP_MAX) {
//             message.info(`Groups can have a max of ${GROUP_MAX} people!`);
//             return users;
//           }
//           users.push(userBasicInfo);
//           return [...users];
//         });
//       }}
//     >
//       <div className="gap-1">
//         {userBasicInfo && (
//           <MakeAvatar
//             displayName={hit.displayName}
//             size="small"
//             userBasicInfo={userBasicInfo}
//           />
//         )}
//         <div className="full-center grow overflow-hidden ic">
//           <h5 className="ic ellipsis fw-400 grey-11">{hit.displayName}</h5>
//         </div>
//       </div>
//       {userBasicInfo && (
//         <KarmaBadge
//           noOnClick={true}
//           noTooltip={true}
//           userBasicInfo={userBasicInfo}
//         />
//       )}
//     </div>
//   );
// }

function DisplayExistingUser({
  groupChatEditting,
  setExistingUsers,
  user,
  userBasicInfo,
}: any) {
  const [isUserOnline, setIsUserOnline] = useState(false);

  useEffect(() => {
    let isUserOnlineSubscribe: any;

    isUserOnlineSubscribe = getIsUserOnline((isUserOnlineObj: any) => {
      if (isUserOnlineObj && isUserOnlineObj.state) {
        if (isUserOnlineObj.state === "online") setIsUserOnline(true);
        else setIsUserOnline(false);
      }
    }, user.id);

    return () => {
      if (isUserOnlineSubscribe) off(isUserOnlineSubscribe);
    };
  }, [user]);

  return (
    <div className="items-center br4 gap-2">
      <div className="items-center gap-2">
        <MakeAvatar
          displayName={user.displayName}
          size="small"
          userBasicInfo={user}
        />
        {/* <Link
          className="full-center grow overflow-hidden ic gap-1"
          href={"/profile?" + user.id}
        >
          <h5 className="button-1 ellipsis grey-11">{user.displayName}</h5>
        </Link> */}
        {isUserOnline && <div className="online-dot" />}
      </div>
      <KarmaBadge noOnClick={true} noTooltip={true} userBasicInfo={user} />
      {groupChatEditting &&
        groupChatEditting.group_owner === userBasicInfo.id && (
          <FontAwesomeIcon
            className="button-9"
            icon={faTimes}
            onClick={() => {
              if (user.id === userBasicInfo.id) {
                return message.error("You can not remove yourself.");
              }

              setExistingUsers((users: any) => {
                users.splice(
                  users.findIndex((user2: any) => user2.id === user.id),
                  1
                );
                return [...users];
              });
            }}
          />
        )}
    </div>
  );
}

export default GroupChatCreateModal;
