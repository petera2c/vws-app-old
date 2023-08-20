"use client";
import React, { useContext, useEffect, useState } from "react";
import { Button } from "antd";

import NotificationList from "../../components/NotificationList";

import { UserContext } from "../../context";

import {
  getNotifications,
  newNotificationsListener,
} from "../../components/Header/util";
import { getIsMobileOrTablet } from "../../util";
import Container from "@/components/containers/Container/Container";
import Page from "@/components/containers/Page/Page";

function NotificationsPage() {
  const { user } = useContext(UserContext);

  const [canShowLoadMore, setCanShowLoadMore] = useState(true);
  const [isMobileOrTablet, setIsMobileOrTablet] = useState<boolean>();
  const [notifications, setNotifications] = useState([]);

  useEffect(() => {
    setIsMobileOrTablet(getIsMobileOrTablet());

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
      className="justify-start align-center bg-blue-2 pa16"
      description=""
      keywords=""
      title="Notifications"
    >
      <Container
        className={
          "column ov-visible gap16 " +
          (isMobileOrTablet ? "" : "container large")
        }
      >
        <Container className="full-center bg-white ov-hidden br8 pa32">
          <h1 className="fw-600 tac">Notifications</h1>
        </Container>
        <Container className="bg-white ov-hidden br8">
          <NotificationList notifications={notifications} />
        </Container>
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
      </Container>
    </Page>
  );
}

export default NotificationsPage;
