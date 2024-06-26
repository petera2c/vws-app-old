"use client";
import React, { useContext, useEffect, useState } from "react";
import { Button } from "antd";

import NotificationList from "../../components/NotificationList";

import { UserContext } from "../../context";

import {
  getNotifications,
  newNotificationsListener,
} from "../../components/Header/util";
import { useIsMobileOrTablet } from "../../util";
import Page from "@/components/containers/Page/Page";

function NotificationsPage() {
  const { user } = useContext(UserContext);
  const isMobileOrTablet = useIsMobileOrTablet();

  const [canShowLoadMore, setCanShowLoadMore] = useState(true);
  const [notifications, setNotifications] = useState([]);

  useEffect(() => {
    let newNotificationsListenerUnsubscribe: any;

    getNotifications([], setCanShowLoadMore, undefined, setNotifications, user);
    newNotificationsListenerUnsubscribe = newNotificationsListener(
      undefined,
      setNotifications,
      user
    );

    return () => {
      if (newNotificationsListenerUnsubscribe)
        newNotificationsListenerUnsubscribe();
    };
  }, [user]);

  return (
    <Page
      className="justify-start items-center bg-blue-2 p-4"
      description=""
      keywords=""
      title="Notifications"
    >
      <div
        className={
          "flex flex-col overflow-visible gap-4 " +
          (isMobileOrTablet ? "" : "container large")
        }
      >
        <div className="full-center bg-white overflow-hidden br8 p-8">
          <h1 className="fw-600 text-center">Notifications</h1>
        </div>
        <div className="bg-white overflow-hidden br8">
          <NotificationList notifications={notifications} />
        </div>
        {canShowLoadMore && (
          <Button
            onClick={() =>
              getNotifications(
                notifications,
                setCanShowLoadMore,
                undefined,
                setNotifications,
                user
              )
            }
            size="large"
            type="primary"
          >
            Load More
          </Button>
        )}
      </div>
    </Page>
  );
}

export default NotificationsPage;
