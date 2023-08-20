"use client";
import React, { useContext, useEffect, useState } from "react";
import { Button } from "antd";

import UserComp from "../../components/User";

import { OnlineUsersContext } from "../../context";
import { getTotalOnlineUsers, getUserAvatars } from "../../util";
import { getOnlineUsers } from "./util";
import Page from "@/components/containers/Page/Page";
import Container from "@/components/containers/Container/Container";

const FETCH_USER_INIT_COUNT = 6;

function OnlineUsers() {
  const [canLoadMoreUsers, setCanLoadMoreUsers] = useState(true);
  const [onlineUsers, setOnlineUsers] = useState([]);
  const [userLoadCount, setUserLoadCount] = useState(FETCH_USER_INIT_COUNT);

  const { setFirstOnlineUsers, setTotalOnlineUsers } =
    useContext(OnlineUsersContext);

  useEffect(() => {
    getTotalOnlineUsers((totalOnlineUsers: number) => {
      getOnlineUsers(setCanLoadMoreUsers, setOnlineUsers, userLoadCount);
      setTotalOnlineUsers(totalOnlineUsers);
      getUserAvatars(setFirstOnlineUsers);
    });
  }, [setFirstOnlineUsers, setOnlineUsers, setTotalOnlineUsers, userLoadCount]);

  return (
    <Page className="column align-center bg-blue-2 gap16 pa16">
      <Container className="justify-center wrap  gap16">
        {onlineUsers.map(({ lastOnline, userID }, index) => {
          return (
            <UserComp
              isUserOnline
              key={index}
              lastOnline={lastOnline}
              showMessageUser
              userID={userID}
            />
          );
        })}
      </Container>
      {canLoadMoreUsers && (
        <Button
          onClick={() =>
            setUserLoadCount(
              (userLoadCount) => userLoadCount + FETCH_USER_INIT_COUNT
            )
          }
          size="large"
          type="primary"
        >
          Load More People
        </Button>
      )}
    </Page>
  );
}

export default OnlineUsers;
