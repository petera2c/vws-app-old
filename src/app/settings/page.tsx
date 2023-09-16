import React, { useContext, useEffect, useState } from "react";
import { doc, updateDoc } from "@firebase/firestore";
import { db } from "../../config/db_init";
import { useDocument } from "react-firebase-hooks/firestore";
import { Button, Input, message } from "antd";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

import LoadingHeart from "../../components/views/loaders/Heart";
import SubscribeColumn from "../../components/SubscribeColumn";

import { UserContext } from "../../context";
import { getIsMobileOrTablet, getUserBasicInfo } from "../../util";
import { getBlockedUsers, unblockUser } from "../account/util";
import Page from "@/components/containers/Page/Page";
import { faTimes } from "@fortawesome/free-solid-svg-icons";
import UserBasicInfo from "@/types/UserBasicInfo";

function SettingsSection() {
  const { user } = useContext(UserContext);

  const [blockedUsers, setBlockedUsers] = useState([]);
  const [canLoadMore, setCanLoadMore] = useState(false);
  const [isMobileOrTablet, setIsMobileOrTablet] = useState<boolean>();

  // @ts-ignore
  const settingsRef = doc(db, "users_settings", user?.uid);
  const [settingsSnapshot] = useDocument(settingsRef, {
    // @ts-ignore
    idField: "id",
  });

  const handleChange = async (
    name: string,
    checked: boolean,
    notify = true
  ) => {
    await updateDoc(settingsRef, { [name]: checked });
    if (notify) message.success("Setting updated!");
  };

  useEffect(() => {
    setIsMobileOrTablet(getIsMobileOrTablet());
  }, []);

  if (!settingsSnapshot || !settingsSnapshot.data())
    return (
      <div
        className={
          "items-center container flex flex-col px-4 " +
          (isMobileOrTablet ? "mobile-full" : "large")
        }
      >
        <LoadingHeart />
      </div>
    );

  return (
    <Page className="p-4">
      <div className="flex">
        <div className="flex flex-col grow bg-white br8 gap-4 mb2 p-4">
          <div className="flex flex-col">
            <h6 className="blue bold">Master Notifications</h6>
            <Setting
              description="Recieve a notification I post a new vent"
              handleChange={handleChange}
              setAll
              setting="vent_new"
              settingsSnapshot={settingsSnapshot}
            />
            <Setting
              description="Recieve a notification when my vent recieves a new comment"
              handleChange={handleChange}
              setAll
              setting="vent_commented"
              settingsSnapshot={settingsSnapshot}
            />
            <Setting
              description="Recieve a notification when my vent recieves a new like"
              handleChange={handleChange}
              setAll
              setting="vent_like"
              settingsSnapshot={settingsSnapshot}
            />
            <Setting
              description="Recieve a notification when someone tags me in a vent or comment"
              handleChange={handleChange}
              setAll
              setting="comment_tagged"
              settingsSnapshot={settingsSnapshot}
            />
            <Setting
              description="Recieve a notification when my comment recieves a new like"
              handleChange={handleChange}
              setAll
              setting="comment_like"
              settingsSnapshot={settingsSnapshot}
            />
            <Setting
              description="Recieve a notification when my quote recieves a new like"
              handleChange={handleChange}
              setAll
              setting="quote_like"
              settingsSnapshot={settingsSnapshot}
            />
            <Setting
              description="Recieve a notification when a user signs up using my unique link"
              handleChange={handleChange}
              setAll
              setting="link_sign_up"
              settingsSnapshot={settingsSnapshot}
            />
          </div>

          <div className="flex flex-col pl-8">
            <h6 className="blue bold">Email Notifications</h6>
            <Setting
              description="Email me when I post a new vent"
              handleChange={handleChange}
              setting="email_vent_new"
              settingsSnapshot={settingsSnapshot}
            />
            <Setting
              description="Email me when my vent recieves a new comment"
              handleChange={handleChange}
              setting="email_vent_commented"
              settingsSnapshot={settingsSnapshot}
            />
            <Setting
              description="Email me when my vent recieves a new like"
              handleChange={handleChange}
              setting="email_vent_like"
              settingsSnapshot={settingsSnapshot}
            />
            <Setting
              description="Email me when someone tags me in a vent or comment"
              handleChange={handleChange}
              setting="email_comment_tagged"
              settingsSnapshot={settingsSnapshot}
            />
            <Setting
              description="Email me when my comment recieves a new like"
              handleChange={handleChange}
              setting="email_comment_like"
              settingsSnapshot={settingsSnapshot}
            />
            <Setting
              description="Email me when my quote recieves a new like"
              handleChange={handleChange}
              setting="email_quote_like"
              settingsSnapshot={settingsSnapshot}
            />
            <Setting
              description="Email me when a user signs up using my link"
              handleChange={handleChange}
              setting="email_link_sign_up"
              settingsSnapshot={settingsSnapshot}
            />
            <Setting
              description="Receive periodic emails on important issues"
              handleChange={handleChange}
              setting="email_promotions"
              settingsSnapshot={settingsSnapshot}
            />
          </div>

          <div className="flex flex-col pl-8">
            <h6 className="blue bold">Mobile Push Notifications</h6>
            <Setting
              description="Send a notification to my phone when I post a new vent"
              handleChange={handleChange}
              setting="mobile_vent_new"
              settingsSnapshot={settingsSnapshot}
            />
            <Setting
              description="Send a notification to my phone when my vent recieves a new comment"
              handleChange={handleChange}
              setting="mobile_vent_commented"
              settingsSnapshot={settingsSnapshot}
            />
            <Setting
              description="Send a notification to my phone when my vent recieves a new like"
              handleChange={handleChange}
              setting="mobile_vent_like"
              settingsSnapshot={settingsSnapshot}
            />
            <Setting
              description="Send a notification to my phone when someone tags me in a vent or comment"
              handleChange={handleChange}
              setting="mobile_comment_tagged"
              settingsSnapshot={settingsSnapshot}
            />
            <Setting
              description="Send a notification to my phone when my comment recieves a new like"
              handleChange={handleChange}
              setting="mobile_comment_like"
              settingsSnapshot={settingsSnapshot}
            />
            <Setting
              description="Send a notification to my phone when my quote recieves a new like"
              handleChange={handleChange}
              setting="mobile_quote_like"
              settingsSnapshot={settingsSnapshot}
            />
            <Setting
              description="Send a notification when a user signs up using my link"
              handleChange={handleChange}
              setting="mobile_link_sign_up"
              settingsSnapshot={settingsSnapshot}
            />
          </div>
          <h6 className="blue bold">Privacy and Content Preferences</h6>

          <div className="flex flex-col items-start gap-4">
            <button
              className="button-4"
              onClick={() => {
                if (blockedUsers && blockedUsers.length > 0) {
                  setBlockedUsers([]);
                  setCanLoadMore(false);
                } else
                  getBlockedUsers(
                    [],

                    setBlockedUsers,
                    setCanLoadMore,
                    user!.uid
                  );
              }}
            >
              Blocked Users
            </button>

            {blockedUsers.map((blockedUserID) => (
              <UserDisplay
                blockedUserID={blockedUserID}
                key={blockedUserID}
                setBlockedUsers={setBlockedUsers}
                userID={user!.uid}
              />
            ))}
            {canLoadMore && (
              <Button
                onClick={() => {
                  getBlockedUsers(
                    blockedUsers,

                    setBlockedUsers,
                    setCanLoadMore,
                    user!.uid
                  );
                }}
                size="large"
                type="primary"
              >
                Load More
              </Button>
            )}
          </div>

          <p className="">
            Your private information will never be shared with anyone. Ever.
          </p>
        </div>
        <SubscribeColumn slot="1120703532" />
      </div>
    </Page>
  );
}

const UserDisplay = ({
  blockedUserID,
  setBlockedUsers,
  userID,
}: {
  blockedUserID: string;
  setBlockedUsers: any;
  userID: string;
}) => {
  const [userBasicInfo, setUserBasicInfo] = useState<UserBasicInfo>();

  useEffect(() => {
    getUserBasicInfo((userBasicInfo: UserBasicInfo) => {
      setUserBasicInfo(userBasicInfo);
    }, blockedUserID);
  }, [blockedUserID]);

  return (
    <button
      className="button-2 fs-18 br4 gap-2 p-2"
      onClick={() => unblockUser(blockedUserID, setBlockedUsers, userID)}
    >
      {userBasicInfo?.displayName}
      <FontAwesomeIcon icon={faTimes} />
    </button>
  );
};

const Setting = ({
  description,
  handleChange,
  setAll,
  setting,
  settingsSnapshot,
}: {
  description: string;
  handleChange: any;
  setAll?: boolean;
  setting: string;
  settingsSnapshot: any;
}) => {
  const master = "master_" + setting;
  const mobile = "mobile_" + setting;
  const email = "email_" + setting;

  let main = master;
  if (!setAll) main = setting;

  return (
    <div
      className="cursor-pointer items-center"
      onClick={() => {
        if (setAll) {
          handleChange(master, !settingsSnapshot.data()[master]);
          handleChange(email, !settingsSnapshot.data()[master], false);
          handleChange(mobile, !settingsSnapshot.data()[master], false);
        } else handleChange(main, !settingsSnapshot.data()[main]);
      }}
    >
      <Input
        className="mr8"
        checked={settingsSnapshot.data()[main]}
        style={{ minWidth: "13px" }}
        type="checkbox"
      />

      <p className="">{description}</p>
    </div>
  );
};

export default SettingsSection;
