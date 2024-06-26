import React, { useContext, useEffect } from "react";
import useState from "react-usestateref";
import { sendEmailVerification } from "@firebase/auth";
import { Button, Dropdown, Input, message } from "antd";

import { UserContext } from "../../context";
import { isPageActive, signOut2 } from "../../util";
import {
  conversationsListener,
  newNotificationsListener,
  getNotifications,
  getUnreadConversations,
  isUserInQueueListener,
  leaveQueue,
  readNotifications,
  resetUnreadConversationCount,
} from "./util";

import DisplayName from "../views/DisplayName";
import NotificationList from "../NotificationList";

import { useRouter, useSearchParams } from "next/navigation";
import { usePathname } from "next/navigation";
import Link from "next/link";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faBell,
  faChevronDown,
  faCog,
  faComments,
  faHouse,
  faSearch,
  faSignOut,
  faUser,
  faUserAstronaut,
} from "@fortawesome/free-solid-svg-icons";
import { useRecoilState } from "recoil";
import { starterModalAtom } from "@/atoms/ModalVisibility";

function Header() {
  const [, setStarterModal] = useRecoilState(starterModalAtom);

  const navigate = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const search = searchParams.toString();

  const { user, userBasicInfo } = useContext(UserContext);

  const [isUserInQueue, setIsUserInQueue, isUserInQueueRef] = useState();
  const [notificationCounter, setNotificationCounter] = useState(0);
  const [notifications, setNotifications] = useState([]);
  const [unreadConversationsCount, setUnreadConversationsCount] = useState();

  const [ventSearchString, setVentSearchString] = useState(
    pathname.substring(0, 7) === "/search"
      ? search.substring(1, search.length)
      : ""
  );

  useEffect(() => {
    let conversationsUnsubscribe: any;
    let isUserInQueueUnsubscribe: any;
    let newConversationsListenerUnsubscribe: any;
    let newNotificationsListenerUnsubscribe: any;

    if (user) {
      if (pathname === "/conversations")
        resetUnreadConversationCount(setUnreadConversationsCount, user.uid);

      getNotifications(
        [],
        undefined,
        setNotificationCounter,
        setNotifications,
        user
      );

      conversationsUnsubscribe = conversationsListener(navigate, user.uid);
      isUserInQueueUnsubscribe = isUserInQueueListener(
        setIsUserInQueue,
        user.uid
      );
      newConversationsListenerUnsubscribe = getUnreadConversations(
        pathname.substring(0, 7) === "/search",
        pathname,
        setUnreadConversationsCount,
        user.uid
      );
      newNotificationsListenerUnsubscribe = newNotificationsListener(
        setNotificationCounter,
        setNotifications,
        user
      );
    }

    const cleanup = () => {
      if (newNotificationsListenerUnsubscribe)
        newNotificationsListenerUnsubscribe();
      if (conversationsUnsubscribe) conversationsUnsubscribe();
      if (user && isUserInQueueRef.current) leaveQueue(user.uid);

      window.removeEventListener("beforeunload", cleanup);
    };

    window.addEventListener("beforeunload", cleanup);

    return () => {
      cleanup();
      if (isUserInQueueUnsubscribe) isUserInQueueUnsubscribe();
      if (newConversationsListenerUnsubscribe)
        newConversationsListenerUnsubscribe();
      if (newNotificationsListenerUnsubscribe)
        newNotificationsListenerUnsubscribe();
    };
  }, [isUserInQueueRef, navigate, pathname, setIsUserInQueue, user]);

  return (
    <div className="flex flex-col w-full">
      <div className="flex flex-col w-full justify-center bg-white border-top large active">
        <div className="grid-3 w-full items-center px-8 py-2">
          <div className="flex full-center">
            <Link href="/">
              <img
                alt="Go Home"
                className="cursor-pointer"
                src="/svgs/icon.svg"
                style={{ height: "50px", width: "50px" }}
              />
            </Link>
          </div>

          <div className="flex full-center flex-wrap grow gap-8">
            <div className="flex flex-wrap gap-8">
              <Link
                className={
                  "full-center flex button-3 gap-2 py-1 " +
                  isPageActive("/", pathname) +
                  isPageActive("/my-feed", pathname.substring(0, 8)) +
                  isPageActive("/recent", pathname.substring(0, 7)) +
                  isPageActive("/trending", pathname.substring(0, 9))
                }
                href="/"
              >
                <FontAwesomeIcon icon={faHouse} />
                <p className="ic">Home</p>
              </Link>

              <Link
                className={
                  "full-center flex button-3 gap-2 py-1 " +
                  isPageActive("/conversations", pathname.substring(0, 14))
                }
                href="/conversations"
              >
                <FontAwesomeIcon icon={faComments} />
                <p className="ic">Inbox</p>

                {Boolean(unreadConversationsCount) && (
                  <p className="fs-14 bg-red white round ml4 p-1 br4">
                    {unreadConversationsCount}
                  </p>
                )}
              </Link>
            </div>
            <div className="full-center">
              <Input
                autoFocus={
                  pathname.substring(0, 7) === "/search" ? true : false
                }
                onChange={(e) => {
                  setVentSearchString(e.target.value);

                  if (
                    e.target.value ||
                    (!e.target.value && pathname === "search")
                  )
                    navigate.push("/search?" + e.target.value);
                }}
                placeholder="Search"
                prefix={
                  <FontAwesomeIcon className="grey-5 mr-2" icon={faSearch} />
                }
                type="text"
                value={ventSearchString}
              />
            </div>
            <Link href="/vent-to-strangers">
              <Button size="large" type="primary">
                Post a Vent
              </Button>
            </Link>
          </div>
          <div className="flex full-center flex-wrap gap-2">
            {!user && (
              <Button onClick={() => setStarterModal("sign-in")} size="large">
                Login
              </Button>
            )}
            {!user && (
              <Button
                onClick={() => setStarterModal("sign-up")}
                size="large"
                type="primary"
              >
                Sign Up
              </Button>
            )}
            {user && (
              <div className="flex items-center gap-4">
                <Dropdown
                  overlay={
                    <div className="bg-white shadow-2 p-2 br8">
                      {/* <AccountLink
                        icon={faChartNetwork}
                        link="/profile"
                        pathname={pathname}
                        text="My Public Profile"
                      /> */}
                      <AccountLink
                        icon={faUser}
                        link="/account"
                        pathname={pathname}
                        text="Account"
                      />
                      <AccountLink
                        icon={faUserAstronaut}
                        link="/avatar"
                        pathname={pathname}
                        text="Avatar"
                      />
                      <AccountLink
                        icon={faCog}
                        link="/settings"
                        pathname={pathname}
                        text="Notification Settings"
                      />
                      <AccountLink
                        icon={faSignOut}
                        onClick={() => {
                          signOut2(user.uid);
                        }}
                        pathname={pathname}
                        text="Sign Out"
                      />
                    </div>
                  }
                  placement="bottomRight"
                  trigger={["click"]}
                >
                  <div className="grow items-center overflow-hidden cursor-pointer gap-2">
                    <DisplayName
                      displayName={userBasicInfo?.displayName}
                      isLink={false}
                      noBadgeOnClick
                      noTooltip
                      userBasicInfo={userBasicInfo}
                    />
                    <FontAwesomeIcon icon={faChevronDown} />
                  </div>
                </Dropdown>

                <Dropdown
                  overlay={
                    <div
                      className="flex flex-col container small bg-white shadow-2 overflow-auto br8"
                      style={{
                        maxHeight: "300px",
                      }}
                    >
                      <NotificationList notifications={notifications} />
                      <div className="p-4">
                        <Link className="w-full" href="/notifications">
                          <Button
                            className="w-full"
                            size="large"
                            type="primary"
                          >
                            View All
                          </Button>
                        </Link>
                      </div>
                    </div>
                  }
                  onOpenChange={() => {
                    readNotifications(notifications, setNotificationCounter);
                  }}
                  trigger={["click"]}
                >
                  <div className="cursor-pointer relative">
                    <FontAwesomeIcon className="blue" icon={faBell} size="2x" />
                    {notificationCounter > 0 && (
                      <p
                        className="fs-14 bg-red white p-1 br8"
                        style={{
                          position: "absolute",
                          top: "-12px",
                          right: "-12px",
                          pointerEvents: "none",
                        }}
                      >
                        {notificationCounter}
                      </p>
                    )}
                  </div>
                </Dropdown>
              </div>
            )}
          </div>
        </div>
      </div>
      {user && isUserInQueue && (
        <div className="flex full-center w-full bg-white border-top gap-2 py-2">
          <p>You are in queue to chat with a stranger</p>
          <Button onClick={() => leaveQueue(user.uid)} size="large" type="link">
            Leave Queue
          </Button>
        </div>
      )}
      {user && !user.emailVerified && (
        <div className="flex full-center w-full bg-blue-2">
          <h4 className="text-center mr-4">
            Please verify your email address!
          </h4>
          <button
            className="button-2 no-bold py-2 px-4 my-4 br8"
            onClick={() => {
              user.reload();
              sendEmailVerification(user)
                .then(() => {
                  message.success("Verification email sent! :)");
                })
                .catch((error) => {
                  message.error(error);
                });
            }}
          >
            Re-send verification link
          </button>
        </div>
      )}
    </div>
  );
}

function AccountLink({ icon, link, onClick, pathname, text }: any) {
  if (link)
    return (
      <Link
        className={
          "w-full items-center grid-1 button-4 cursor-pointer py-2 " +
          isPageActive(link, pathname)
        }
        href={link}
      >
        <div className="flex blue w-full full-center">
          <FontAwesomeIcon icon={icon} style={{ fontSize: "1.25rem" }} />
        </div>
        <h5 className="grey-1 ic">{text}</h5>
      </Link>
    );

  if (onClick)
    return (
      <div
        className="w-full items-center grid-1 button-4 cursor-pointer py-2"
        onClick={onClick}
      >
        <div className="full-center">
          <FontAwesomeIcon icon={icon} style={{ fontSize: "1.25rem" }} />
        </div>
        <h5 className="grey-1 ic">{text}</h5>
      </div>
    );
  return <></>;
}

export default Header;
