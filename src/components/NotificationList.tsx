import React from "react";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";

import Link from "next/link";
import Notification from "@/types/Notification";

dayjs.extend(relativeTime);

function NotificationList({
  notifications,
}: {
  notifications: Notification[];
}) {
  return (
    <div className="flex flex-col w-full">
      {notifications.map((notification, index) => {
        return (
          <Link
            className="flex flex-col border-bottom grey-1 p-4"
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
        <div className="full-center">
          <h6 className="fw-400 p-4">There are no notifications to show!</h6>
        </div>
      )}
    </div>
  );
}

export default NotificationList;
