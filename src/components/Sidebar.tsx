import React, { useContext, useEffect, useState } from "react";
import { Space } from "antd";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

import { OnlineUsersContext } from "../context";
import {
  chatQueueEmptyListener,
  getTotalOnlineUsers,
  getUserAvatars,
  isPageActive,
} from "../util";
import Link from "next/link";
import MakeAvatar from "./views/MakeAvatar";
import UserBasicInfo from "@/types/UserBasicInfo";
import {
  faComments,
  faHeart,
  faInfo,
  faPrayingHands,
  faQuoteLeft,
  faSmileBeam,
  faUserFriends,
} from "@fortawesome/free-solid-svg-icons";
import { usePathname } from "next/navigation";

function Sidebar() {
  const pathname = usePathname();

  const {
    firstOnlineUsers,
    totalOnlineUsers,
    setFirstOnlineUsers,
    setTotalOnlineUsers,
  } = useContext(OnlineUsersContext);

  const [queueLength, setQueueLength] = useState();

  useEffect(() => {
    let chatQueueListenerUnsubscribe: any;

    chatQueueListenerUnsubscribe = chatQueueEmptyListener(setQueueLength);

    getTotalOnlineUsers((totalOnlineUsers: number) => {
      setTotalOnlineUsers(totalOnlineUsers);
      getUserAvatars(setFirstOnlineUsers);
    });
    return () => {
      if (chatQueueListenerUnsubscribe) chatQueueListenerUnsubscribe();
    };
  }, [setFirstOnlineUsers, setTotalOnlineUsers]);

  return (
    <div className="flex flex-col shrink-0 container small overflow-auto bg-white border-top gap-2 pt8 px16 pb16">
      <SideBarLink
        icon={faUserFriends}
        link="/people-online"
        pathname={pathname}
        firstOnlineUsers={firstOnlineUsers}
        text={
          (totalOnlineUsers ? totalOnlineUsers : "0") +
          (totalOnlineUsers === 1 ? " Person" : " People") +
          " Online"
        }
        totalOnlineUsers={totalOnlineUsers}
      />
      <SideBarLink
        icon={faQuoteLeft}
        link="/quote-contest"
        pathname={pathname}
        text="Daily Quote Contest"
      />
      <SideBarLink
        icon={faComments}
        link="/chat-with-strangers"
        pathname={pathname}
        text={
          "Chat With Strangers" +
          (queueLength === -1 ? "" : ` (${queueLength})`)
        }
      />

      <SideBarLink
        icon={faComments}
        link="/rewards"
        pathname={pathname}
        text="Rewards"
      />
      <SideBarLink
        icon={faSmileBeam}
        link="/feel-good-quotes-month"
        pathname={pathname}
        text="Feel Good Quotes"
      />
      <SideBarLink
        icon={faPrayingHands}
        link="/rules"
        pathname={pathname}
        text="Rules"
      />
      <SideBarLink
        icon={faInfo}
        link="/site-info"
        pathname={pathname}
        text="VWS Info"
      />
    </div>
  );
}

const SideBarLink = ({
  icon,
  link,
  onClick,
  pathname,
  firstOnlineUsers,
  text,
  totalOnlineUsers,
}: any) => {
  if (link)
    return (
      <Link
        className={
          "flex items-center button-4 py8 " +
          isPageActive(link, pathname) +
          (firstOnlineUsers ? " grid-2" : " grid-1")
        }
        href={link}
      >
        <div className="flex full-center w-full blue">
          <FontAwesomeIcon icon={icon} style={{ fontSize: "1.25rem" }} />
        </div>
        <h5 className="ellipsis ic">{text}</h5>
        {firstOnlineUsers && (
          <div className="flex grow items-end">
            {firstOnlineUsers.map(
              (userBasicInfo: UserBasicInfo, index: number) => (
                <div
                  className="avatar small items-end"
                  key={userBasicInfo.id}
                  style={{
                    transform: `translateX(-${index * 28}px)`,
                  }}
                >
                  <MakeAvatar
                    displayName={userBasicInfo.displayName}
                    userBasicInfo={userBasicInfo}
                    size="small"
                  />
                </div>
              )
            )}
            {totalOnlineUsers - firstOnlineUsers.length > 0 && (
              <div
                className="avatar very-small blue bg-blue-2"
                style={{
                  transform: `translateX(-${firstOnlineUsers.length * 28}px)`,
                }}
              >
                +{totalOnlineUsers - firstOnlineUsers.length}
              </div>
            )}
          </div>
        )}
      </Link>
    );

  if (onClick)
    return (
      <div
        className="w-full items-center grid-1 button-4 cursor-pointer py8"
        onClick={onClick}
      >
        <div className="flex full-center w-full">
          <FontAwesomeIcon icon={icon} style={{ fontSize: "1.25rem" }} />
        </div>
        <h5 className="grey-1 ic">{text}</h5>
      </div>
    );

  return <></>;
};

export default Sidebar;
