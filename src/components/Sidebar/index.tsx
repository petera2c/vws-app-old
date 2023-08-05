import React, { useContext, useEffect, useState } from "react";
import { Space } from "antd";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

import Container from "../containers/Container";

import { OnlineUsersContext } from "../../context";
import {
  chatQueueEmptyListener,
  getTotalOnlineUsers,
  getUserAvatars,
  isPageActive,
  useIsMounted,
} from "../../util";
import Link from "next/link";
import MakeAvatar from "../views/MakeAvatar";
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
  const isMounted = useIsMounted();
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

    chatQueueListenerUnsubscribe = chatQueueEmptyListener(
      isMounted,
      setQueueLength
    );

    getTotalOnlineUsers((totalOnlineUsers: number) => {
      if (isMounted()) {
        setTotalOnlineUsers(totalOnlineUsers);
        getUserAvatars(isMounted, setFirstOnlineUsers);
      }
    });
    return () => {
      if (chatQueueListenerUnsubscribe) chatQueueListenerUnsubscribe();
    };
  }, [isMounted, setFirstOnlineUsers, setTotalOnlineUsers]);

  return (
    <Space
      className="container small column ov-auto bg-white border-top pt8 px16 pb16"
      direction="vertical"
    >
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

      <a
        className="grid-1 align-center button-4 clickable py8 "
        href="https://forms.gle/fQ5xyZL52HZTEp2C7"
        rel="noreferrer"
        target="_blank"
      >
        <Container className="blue x-fill full-center">
          <FontAwesomeIcon icon={faHeart} style={{ fontSize: "1.25rem" }} />
        </Container>
        <h5 className="ellipsis ic">Give Feedback</h5>
      </a>
    </Space>
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
          "align-center button-4 clickable py8 " +
          isPageActive(link, pathname) +
          (firstOnlineUsers ? " grid-2" : " grid-1")
        }
        href={link}
      >
        <Container className="blue x-fill full-center">
          <FontAwesomeIcon icon={icon} style={{ fontSize: "1.25rem" }} />
        </Container>
        <h5 className="ellipsis ic">{text}</h5>
        {firstOnlineUsers && (
          <Container className="flex-fill align-end">
            {firstOnlineUsers.map(
              (userBasicInfo: UserBasicInfo, index: number) => (
                <Container
                  className="avatar small align-end"
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
                </Container>
              )
            )}
            {totalOnlineUsers - firstOnlineUsers.length > 0 && (
              <Container
                className="avatar very-small blue bg-blue-2"
                style={{
                  transform: `translateX(-${firstOnlineUsers.length * 28}px)`,
                }}
              >
                +{totalOnlineUsers - firstOnlineUsers.length}
              </Container>
            )}
          </Container>
        )}
      </Link>
    );

  if (onClick)
    return (
      <Container
        className="x-fill align-center grid-1 button-4 clickable py8"
        onClick={onClick}
      >
        <Container className="flex x-fill full-center">
          <FontAwesomeIcon icon={icon} style={{ fontSize: "1.25rem" }} />
        </Container>
        <h5 className="grey-1 ic">{text}</h5>
      </Container>
    );

  return <></>;
};

export default Sidebar;
