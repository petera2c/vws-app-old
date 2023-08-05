import React, { useContext, useEffect } from "react";
import useState from "react-usestateref";
import { sendEmailVerification } from "@firebase/auth";
import { Button, message, Space } from "antd";

import Container from "../containers/Container/Container";
import HandleOutsideClick from "../containers/HandleOutsideClick/HandleOutsideClick";
import DisplayName from "../views/DisplayName";
import StarterModal from "../modals/Starter";

import { UserContext, OnlineUsersContext } from "../../context";

import {
  chatQueueEmptyListener,
  getTotalOnlineUsers,
  getUserAvatars,
  isPageActive,
  signOut2,
  useIsMounted,
} from "../../util";
import {
  conversationsListener,
  newNotificationsListener,
  getMobileOperatingSystem,
  getUnreadConversations,
  isUserInQueueListener,
  leaveQueue,
  readNotifications,
  resetUnreadConversationCount,
} from "./util";
import { usePathname } from "next/navigation";
import { useRouter } from "next/router";
import Link from "next/link";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faBars,
  faBell,
  faChevronDown,
  faCog,
  faComments,
  faConciergeBell,
  faInfo,
  faQuoteLeft,
  faSearch,
  faSignOut,
  faSmileBeam,
  faTimes,
  faUser,
  faUserAstronaut,
  faUserFriends,
} from "@fortawesome/free-solid-svg-icons";

function Header() {
  const isMounted = useIsMounted();
  const pathname = usePathname();
  const navigate = useRouter();
  const { search } = location;

  const { setFirstOnlineUsers, setTotalOnlineUsers, totalOnlineUsers } =
    useContext(OnlineUsersContext);
  const { user, userBasicInfo } = useContext(UserContext);

  const [accountSectionActive, setAccountSectionActive] = useState(false);
  const [isUserInQueue, setIsUserInQueue, isUserInQueueRef] = useState();
  const [mobileHeaderActive, setMobileHeaderActive] = useState(false);
  const [notificationCounter, setNotificationCounter] = useState(0);
  const [notifications, setNotifications] = useState([]);
  const [queueLength, setQueueLength] = useState();
  const [showMobileAppDownload, setShowMobileAppDownload] = useState(true);
  const [showNotificationDropdown, setShowNotificationDropdown] =
    useState(false);
  const [starterModal, setStarterModal] = useState<string | boolean>(false);
  const [unreadConversationsCount, setUnreadConversationsCount] = useState();

  const [ventSearchString, setVentSearchString] = useState(
    pathname.substring(0, 7) === "/search"
      ? search.substring(1, search.length)
      : ""
  );

  useEffect(() => {
    let chatQueueListenerUnsubscribe: any;
    let conversationsUnsubscribe: any;
    let isUserInQueueUnsubscribe: any;
    let newConversationsListenerUnsubscribe: any;
    let newNotificationsListenerUnsubscribe: any;

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

    if (user) {
      if (pathname === "/chat")
        resetUnreadConversationCount(
          isMounted,
          setUnreadConversationsCount,
          user.uid
        );

      conversationsUnsubscribe = conversationsListener(navigate, user.uid);
      isUserInQueueUnsubscribe = isUserInQueueListener(
        isMounted,
        setIsUserInQueue,
        user.uid
      );

      newConversationsListenerUnsubscribe = getUnreadConversations(
        isMounted,
        pathname.substring(0, 7) === "/search",
        pathname,
        setUnreadConversationsCount,
        user.uid
      );
      newNotificationsListenerUnsubscribe = newNotificationsListener(
        isMounted,
        setNotificationCounter,
        setNotifications,
        user
      );
    }

    const cleanup = () => {
      if (conversationsUnsubscribe) conversationsUnsubscribe();
      if (user && isUserInQueueRef.current) leaveQueue(user.uid);

      window.removeEventListener("beforeunload", cleanup);
    };

    window.addEventListener("beforeunload", cleanup);

    return () => {
      cleanup();
      if (chatQueueListenerUnsubscribe) chatQueueListenerUnsubscribe();
      if (isUserInQueueUnsubscribe) isUserInQueueUnsubscribe();
      if (newNotificationsListenerUnsubscribe)
        newNotificationsListenerUnsubscribe();
      if (newConversationsListenerUnsubscribe)
        newConversationsListenerUnsubscribe();
    };
  }, [
    isMounted,
    isUserInQueueRef,
    navigate,
    pathname,
    setFirstOnlineUsers,
    setIsUserInQueue,
    setTotalOnlineUsers,
    unreadConversationsCount,
    user,
  ]);

  return (
    <HandleOutsideClick
      className="sticky top-0 relative column x-fill full-center bg-white border-top large active shadow-2"
      close={() => {
        setAccountSectionActive(false);
        setMobileHeaderActive(false);
      }}
      style={{ zIndex: 10 }}
    >
      <Container className="x-fill align-center justify-between border-bottom py8 px16">
        <Link href="/">
          <img
            alt="Go Home"
            className="clickable"
            onClick={() => setMobileHeaderActive(false)}
            src="/svgs/icon.svg"
            style={{ height: "50px", width: "50px" }}
          />
        </Link>
        <Container>
          {user && (
            <Link className="relative mr16" href="/notifications">
              <FontAwesomeIcon
                className="clickable blue"
                icon={faBell}
                onClick={() => {
                  setShowNotificationDropdown(!showNotificationDropdown);

                  readNotifications(notifications);
                }}
                size="2x"
              />
              {notificationCounter > 0 && !showNotificationDropdown && (
                <p
                  className="fs-14 bg-red white pa4 br8"
                  style={{
                    position: "absolute",
                    top: "-12px",
                    right: "-12px",
                    pointerEvents: "none",
                    zIndex: 1,
                  }}
                >
                  {notificationCounter}
                </p>
              )}
            </Link>
          )}

          <Container className="full-center border-all active pa8 br4">
            <FontAwesomeIcon
              className="blue"
              icon={faBars}
              onClick={() => {
                setMobileHeaderActive(!mobileHeaderActive);
                setAccountSectionActive(false);
              }}
            />
          </Container>
        </Container>
      </Container>
      {showMobileAppDownload && (
        <Container className="full-center border-top gap8 pa8">
          <a
            className="button-4"
            href={
              getMobileOperatingSystem() === "ios"
                ? "https://apps.apple.com/us/app/vent-with-strangers/id1509120090"
                : "https://play.google.com/store/apps/details?id=com.commontech.ventwithstrangers"
            }
            rel="noreferrer"
            target="_blank"
          >
            <h4 className="tac">
              Download the <span className="blue">Mobile App</span>
            </h4>
          </a>
          <FontAwesomeIcon
            className="button-9"
            icon={faTimes}
            onClick={() => setShowMobileAppDownload(false)}
          />
        </Container>
      )}
      {(mobileHeaderActive || pathname.substring(0, 7) === "/search") && (
        <Space align="center" className="bg-grey-4 py4 px8 my8 br4">
          <FontAwesomeIcon
            className="grey-5 mr8"
            icon={faSearch}
            onClick={() => setMobileHeaderActive(false)}
          />
          <input
            autoFocus={pathname.substring(0, 7) === "/search" ? true : false}
            className="no-border bg-grey-4 br4"
            onChange={(e) => {
              setVentSearchString(e.target.value);
              navigate.push("/search?" + e.target.value);
              setMobileHeaderActive(false);
            }}
            placeholder="Search"
            type="text"
            value={ventSearchString}
          />
        </Space>
      )}
      {mobileHeaderActive && (
        <Space
          align="center"
          className="mobile-header ov-auto shadow-2 pa16"
          direction="vertical"
          onClick={() => setMobileHeaderActive(false)}
          size="large"
          style={{ maxHeight: "70vh" }}
        >
          {user && (
            <Container className="align-center column">
              <Space
                align="center"
                onClick={(e) => {
                  e.stopPropagation();
                  setAccountSectionActive(!accountSectionActive);
                }}
              >
                <DisplayName
                  displayName={user.displayName}
                  isLink={false}
                  noBadgeOnClick
                  noTooltip
                  userBasicInfo={userBasicInfo}
                />
                <FontAwesomeIcon icon={faChevronDown} />
              </Space>
              {accountSectionActive && (
                <Space
                  align="center"
                  className="pt16"
                  direction="vertical"
                  size="middle"
                >
                  <Link
                    className={
                      "flex full-center button-3 " +
                      isPageActive("/profile", pathname)
                    }
                    href="/profile"
                  >
                    {/* <FontAwesomeIcon className="mx8" icon={faChartNetwork} /> */}
                    <p className="ic">Profile</p>
                  </Link>

                  <Link
                    className={
                      "flex full-center button-3 " +
                      isPageActive("/account", pathname)
                    }
                    href="/account"
                  >
                    <FontAwesomeIcon className="mx8" icon={faUser} />
                    <p className="ic">Account</p>
                  </Link>
                  <Link
                    className={
                      "flex full-center button-3 " +
                      isPageActive("/avatar", pathname)
                    }
                    href="/avatar"
                  >
                    <FontAwesomeIcon className="mx8" icon={faUserAstronaut} />
                    <p className="ic">Avatar</p>
                  </Link>

                  <Link
                    className={
                      "flex full-center button-3 " +
                      isPageActive("/settings", pathname)
                    }
                    href="/settings"
                  >
                    <FontAwesomeIcon className="mx8" icon={faCog} />
                    <p className="ic">Settings</p>
                  </Link>
                  <p
                    className="tac fs-14"
                    onClick={() => {
                      signOut2(user.uid);
                    }}
                  >
                    <FontAwesomeIcon className="mx8" icon={faSignOut} />
                    Sign Out
                  </p>
                </Space>
              )}
            </Container>
          )}

          <Space align="center" direction="vertical" size="middle">
            <Link
              className={
                "flex full-center button-3 " +
                isPageActive("/people-online", pathname)
              }
              href="/people-online"
            >
              <FontAwesomeIcon className="mr8" icon={faUserFriends} />
              <p className="ic">
                {totalOnlineUsers}{" "}
                {totalOnlineUsers === 1 ? "Person" : "People"} Online
              </p>
            </Link>
            <Link
              className={
                "flex full-center button-3 " +
                isPageActive("/vent-to-strangers", pathname)
              }
              href="/vent-to-strangers"
            >
              <FontAwesomeIcon className="mr8" icon={faConciergeBell} />
              <p className="ic">Post a Vent</p>
            </Link>
            <Link
              className={
                "flex full-center button-3 " +
                isPageActive("/trending", pathname) +
                isPageActive("/", pathname)
              }
              href="/trending"
            >
              {/* <FontAwesomeIcon className="mr8" icon={faAnalytics} /> */}
              <p className="ic">Trending</p>
            </Link>
            <Link
              className={
                "flex full-center button-3 " + isPageActive("/recent", pathname)
              }
              href="/recent"
            >
              <FontAwesomeIcon className="mr8" icon={faConciergeBell} />
              <p className="ic">Recent</p>
            </Link>
            <Link
              className={
                "button-3 flex full-center relative " +
                isPageActive("/chat", pathname)
              }
              href="/chat"
            >
              <FontAwesomeIcon className="mr8" icon={faComments} />
              <p className="ic">Inbox</p>

              {Boolean(unreadConversationsCount) && (
                <p className="fs-14 bg-red white round ml4 pa4 br4">
                  {unreadConversationsCount}
                </p>
              )}
            </Link>

            <Link
              className={
                "button-3 flex full-center relative " +
                isPageActive("/chat-with-strangers", pathname)
              }
              href="/chat-with-strangers"
            >
              <FontAwesomeIcon className="mr8" icon={faComments} />
              <p className="ic">
                {"Chat With Strangers" +
                  (queueLength === -1 ? "" : ` (${queueLength})`)}
              </p>
            </Link>
            <Link
              className={
                "flex full-center button-3 " +
                isPageActive("/rewards", pathname)
              }
              href="/rewards"
            >
              {/* <FontAwesomeIcon className="mr8" icon={faStarShooting} /> */}
              <p className="ic">Rewards</p>
            </Link>
            <Link
              className={
                "button-3 flex full-center relative " +
                isPageActive("/quote-contest", pathname)
              }
              href="/quote-contest"
            >
              <FontAwesomeIcon className="mr8" icon={faQuoteLeft} />
              <p className="ic">Daily Quote Contest</p>
            </Link>
            <Link
              className={
                "button-3 flex full-center relative " +
                isPageActive("/feel-good-quotes-month", pathname)
              }
              href="/feel-good-quotes-month"
            >
              <FontAwesomeIcon className="mr8" icon={faSmileBeam} />
              <p className="ic">Feel Good Quotes</p>
            </Link>

            <Link
              className={
                "flex full-center button-3 " +
                isPageActive("/site-info", pathname)
              }
              href="/site-info"
            >
              <FontAwesomeIcon className="mr8" icon={faInfo} />
              <p className="ic">Site Info</p>
            </Link>
          </Space>
          {!user && (
            <Space>
              <Button onClick={() => setStarterModal("login")}>Login</Button>

              <Button onClick={() => setStarterModal("signUp")} type="primary">
                Sign Up
              </Button>
            </Space>
          )}
        </Space>
      )}
      {user && isUserInQueue && (
        <Container className="x-fill full-center bg-white border-top gap8 py8 px16">
          <p>You are in queue to chat with a stranger</p>
          <Button
            onClick={() => leaveQueue(user.uid)}
            size="large"
            type="primary"
          >
            Leave Queue
          </Button>
        </Container>
      )}
      {user && !user.emailVerified && (
        <Container className="x-fill full-center bg-blue-2">
          <h4 className="tac mr16">Please verify your email address!</h4>
          <button
            className="button-2 no-bold py8 px16 my16 br8"
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
        </Container>
      )}
      {starterModal && (
        <StarterModal
          activeModal={starterModal}
          setActiveModal={setStarterModal}
        />
      )}
    </HandleOutsideClick>
  );
}

export default Header;
