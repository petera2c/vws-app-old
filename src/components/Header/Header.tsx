import React, { useContext, useEffect } from "react";
import useState from "react-usestateref";
import { sendEmailVerification } from "@firebase/auth";
import { Button, Dropdown, message } from "antd";

import { UserContext } from "../../context";
import { isPageActive, useIsMounted, signOut2 } from "../../util";
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

import Container from "../containers/Container/Container";
import DisplayName from "../views/DisplayName";
import NotificationList from "../NotificationList";
import StarterModal from "../modals/Starter";
import { useRouter } from "next/navigation";
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
  faTimes,
  faUser,
  faUserAstronaut,
} from "@fortawesome/free-solid-svg-icons";

function Header() {
  const isMounted = useIsMounted();
  const navigate = useRouter();
  const pathname = usePathname();
  const { search } = location;

  const { user, userBasicInfo } = useContext(UserContext);

  const [activeModal, setActiveModal] = useState<string | boolean>("");
  const [isUserInQueue, setIsUserInQueue, isUserInQueueRef] = useState();
  const [notificationCounter, setNotificationCounter] = useState(0);
  const [notifications, setNotifications] = useState([]);
  const [showFeedbackContainer, setShowFeedbackContainer] = useState(false);
  const [showMobileAppDownload, setShowMobileAppDownload] = useState(false);
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
      if (pathname === "/chat")
        resetUnreadConversationCount(
          isMounted,
          setUnreadConversationsCount,
          user.uid
        );

      getNotifications(
        isMounted,
        [],
        undefined,
        setNotificationCounter,
        setNotifications,
        user
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
  }, [isMounted, isUserInQueueRef, navigate, pathname, setIsUserInQueue, user]);

  return (
    <Container className="column x-fill">
      <Container className="column x-fill justify-center bg-white border-top large active">
        <Container className="grid-3 x-fill align-center px32 py8">
          <Container className="full-center">
            <Link href="/">
              <img
                alt="Go Home"
                className="clickable"
                src="/svgs/icon.svg"
                style={{ height: "50px", width: "50px" }}
              />
            </Link>
          </Container>

          <Container className="flex-fill full-center wrap gap32">
            <Container className="wrap gap32">
              <Link
                className={
                  "full-center flex button-3 gap8 py4 " +
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
                  "full-center flex button-3 gap8 py4 " +
                  isPageActive("/chat", pathname.substring(0, 14))
                }
                href="/chat"
              >
                <FontAwesomeIcon icon={faComments} />
                <p className="ic">Inbox</p>

                {Boolean(unreadConversationsCount) && (
                  <p className="fs-14 bg-red white round ml4 pa4 br4">
                    {unreadConversationsCount}
                  </p>
                )}
              </Link>
            </Container>
            <Container className="full-center bg-grey-4 py4 px8 br4">
              <FontAwesomeIcon className="grey-5 mr8" icon={faSearch} />
              <input
                autoFocus={
                  pathname.substring(0, 7) === "/search" ? true : false
                }
                className="no-border bg-grey-4 br4"
                onChange={(e) => {
                  setVentSearchString(e.target.value);

                  if (
                    e.target.value ||
                    (!e.target.value && pathname === "search")
                  )
                    navigate.push("/search?" + e.target.value);
                }}
                placeholder="Search"
                type="text"
                value={ventSearchString}
              />
            </Container>
            <Link href="/vent-to-strangers">
              <Button size="large" type="primary">
                Post a Vent
              </Button>
            </Link>
          </Container>
          <Container className="full-center wrap">
            {!user && (
              <button
                className="blue fw-300 mx32"
                onClick={() => setActiveModal("login")}
              >
                Login
              </button>
            )}
            {!user && (
              <button
                className="white blue-fade px32 py8 br4"
                onClick={() => setActiveModal("signUp")}
              >
                Sign Up
              </button>
            )}
            {user && (
              <Container className="align-center gap16">
                <Dropdown
                  overlay={
                    <div className="bg-white shadow-2 pa8 br8">
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
                  <Container className="flex-fill align-center ov-hidden clickable gap8">
                    <DisplayName
                      displayName={userBasicInfo?.displayName}
                      isLink={false}
                      noBadgeOnClick
                      noTooltip
                      userBasicInfo={userBasicInfo}
                    />
                    <FontAwesomeIcon icon={faChevronDown} />
                  </Container>
                </Dropdown>

                <Dropdown
                  overlay={
                    <Container
                      className="column container small bg-white shadow-2 ov-auto br8"
                      style={{
                        maxHeight: "300px",
                      }}
                    >
                      <NotificationList notifications={notifications} />
                      <Container className="pa16">
                        <Link className="x-fill" href="/notifications">
                          <Button
                            className="x-fill"
                            size="large"
                            type="primary"
                          >
                            View All
                          </Button>
                        </Link>
                      </Container>
                    </Container>
                  }
                  onOpenChange={() => {
                    readNotifications(notifications, setNotificationCounter);
                  }}
                  trigger={["click"]}
                >
                  <Container className="clickable relative">
                    <FontAwesomeIcon className="blue" icon={faBell} size="2x" />
                    {notificationCounter > 0 && (
                      <p
                        className="fs-14 bg-red white pa4 br8"
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
                  </Container>
                </Dropdown>
              </Container>
            )}
          </Container>
        </Container>
        {showMobileAppDownload && (
          <Container className="full-center border-top gap8 pa8">
            <Container className="full-center gap8">
              <p className="fs-22 tac primary">
                Download the Mobile App and give us a 5 star rating pretty
                please 🙏🙌🙏
              </p>
              <a
                className="button-4 fs-22 bold primary border-bottom"
                href="https://apps.apple.com/us/app/vent-with-strangers/id1509120090"
                rel="noreferrer"
                target="_blank"
              >
                Apple
              </a>
              <a
                className="button-4 fs-22 bold primary border-bottom"
                href="https://play.google.com/store/apps/details?id=com.commontech.ventwithstrangers"
                rel="noreferrer"
                target="_blank"
              >
                Android
              </a>
            </Container>
            <FontAwesomeIcon
              className="button-9"
              icon={faTimes}
              onClick={() => setShowMobileAppDownload(false)}
            />
          </Container>
        )}
        {showFeedbackContainer && (
          <Container className="full-center border-top gap8 pa8">
            <a
              className="fs-22 button-4 tac"
              href="https://forms.gle/fQ5xyZL52HZTEp2C7"
              rel="noreferrer"
              target="_blank"
            >
              Please give us feedback on our site!
            </a>
            <FontAwesomeIcon
              className="button-9"
              icon={faTimes}
              onClick={() => setShowFeedbackContainer(false)}
            />
          </Container>
        )}
        <StarterModal
          activeModal={activeModal}
          setActiveModal={setActiveModal}
        />
      </Container>
      {user && isUserInQueue && (
        <Container className="x-fill full-center bg-white border-top gap8 py8">
          <p>You are in queue to chat with a stranger</p>
          <Button onClick={() => leaveQueue(user.uid)} size="large" type="link">
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
    </Container>
  );
}

function AccountLink({ icon, link, onClick, pathname, text }: any) {
  if (link)
    return (
      <Link
        className={
          "x-fill align-center grid-1 button-4 clickable py8 " +
          isPageActive(link, pathname)
        }
        href={link}
      >
        <Container className="flex blue x-fill full-center">
          <FontAwesomeIcon icon={icon} style={{ fontSize: "1.25rem" }} />
        </Container>
        <h5 className="grey-1 ic">{text}</h5>
      </Link>
    );

  if (onClick)
    return (
      <div
        className="x-fill align-center grid-1 button-4 clickable py8"
        onClick={onClick}
      >
        <Container className="full-center">
          <FontAwesomeIcon icon={icon} style={{ fontSize: "1.25rem" }} />
        </Container>
        <h5 className="grey-1 ic">{text}</h5>
      </div>
    );
  return <></>;
}

export default Header;
