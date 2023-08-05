import React from "react";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";

import Container from "./containers/Container/Container";
import Link from "next/link";
import Notification from "@/types/Notification";

dayjs.extend(relativeTime);

function NotificationList({
  notifications,
}: {
  notifications: Notification[];
}) {
  return (
    <Container className="column x-fill">
      {notifications.map((notification, index) => {
        return (
          <Link
            className="column border-bottom grey-1 pa16"
            key={index}
            href={notification.link}
          >
            <h6>{notification.message}</h6>
            <p className="grey-1 ic">
              {dayjs(notification.server_timestamp).fromNow()}
            </p>
          </Link>
        );
      })}
      {((notifications && notifications.length === 0) || !notifications) && (
        <Container className="full-center">
          <h6 className="fw-400 pa16">There are no notifications to show!</h6>
        </Container>
      )}
    </Container>
  );
}

export default NotificationList;
