"use client";

import { ConfigProvider } from "antd";
import {
  Hydrate,
  QueryClient,
  QueryClientProvider,
} from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { Nunito } from "next/font/google";

import ANT_THEME_CUSTOMIZATION from "@/styles/AntDCustom";
import MobileHeader from "@/components/Header/MobileHeader";

import Head from "next/head";
import { RootStyleRegistry } from "@/components/RootStyleRegistry";

import "../styles/global.css";
import { Suspense, useEffect, useRef, useState } from "react";
import LoadingHeart from "@/components/views/loaders/Heart";
import Sidebar from "@/components/Sidebar";
import { OnlineUsersContext, UserContext } from "@/context";
import { useIdleTimer } from "react-idle-timer";
import { getTotalOnlineUsers, getUserAvatars, getUserBasicInfo } from "@/util";
import { User, getAuth, onAuthStateChanged } from "@firebase/auth";
import UserBasicInfo from "@/types/UserBasicInfo";
import {
  getIsUsersBirthday,
  newRewardListener,
  setIsUserOnlineToDatabase,
  setUserOnlineStatus,
} from "./util";

import "../config/firebase_init";
import Header from "@/components/Header/Header";

const nunito = Nunito({ subsets: ["latin"] });

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      cacheTime: Number.POSITIVE_INFINITY,
      retry: 0,
      staleTime: Number.POSITIVE_INFINITY,
    },
  },
});

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [firstOnlineUsers, setFirstOnlineUsers] = useState([]);
  const [isUsersBirthday, setIsUsersBirthday] = useState(false);
  const [newReward, setNewReward] = useState();
  const [totalOnlineUsers, setTotalOnlineUsers] = useState<number>();
  const [userBasicInfo, setUserBasicInfo] = useState<UserBasicInfo>();
  const [user, setUser] = useState<User>();
  const [loading, setLoading] = useState(true);

  onAuthStateChanged(getAuth(), (user) => {
    if (loading) setLoading(false);

    if (user) setUser(user);
    else {
      setUser(undefined);
      if (userBasicInfo?.displayName) setUserBasicInfo(undefined);
    }
  });

  const handleOnIdle = () => {
    if (user && user.uid) {
      setUserOnlineStatus("offline", user.uid);
    }
  };

  const handleOnActive = () => {
    if (user && user.uid) {
      setUserOnlineStatus("online", user.uid);
    }
  };

  const handleOnAction = () => {
    if (user && user.uid) {
      setUserOnlineStatus("online", user.uid);
      getTotalOnlineUsers((totalOnlineUsers: number) => {
        setTotalOnlineUsers(totalOnlineUsers);
        getUserAvatars((firstOnlineUsers: []) => {
          setFirstOnlineUsers(firstOnlineUsers);
        });
      });
    }
  };

  useIdleTimer({
    onAction: handleOnAction,
    onActive: handleOnActive,
    onIdle: handleOnIdle,
    throttle: 10000,
    timeout: 1000 * 60 * 480,
  });

  useEffect(() => {
    let newRewardListenerUnsubscribe: any;
    if (user) {
      newRewardListenerUnsubscribe = newRewardListener(setNewReward, user.uid);
      getIsUsersBirthday(setIsUsersBirthday, user.uid);
      setIsUserOnlineToDatabase(user.uid);

      getUserBasicInfo((newBasicUserInfo: UserBasicInfo) => {
        setUserBasicInfo(newBasicUserInfo);
      }, user.uid);
    }

    return () => {
      if (newRewardListenerUnsubscribe) newRewardListenerUnsubscribe();
    };
  }, [user]);

  return (
    <html lang="en">
      <Head>
        <link
          rel="preconnect"
          href="https://fonts.gstatic.com"
          crossOrigin={"true"}
        />
      </Head>
      <body className={nunito.className}>
        <RootStyleRegistry>
          <ConfigProvider theme={ANT_THEME_CUSTOMIZATION}>
            <QueryClientProvider client={queryClient}>
              <UserContext.Provider
                value={{
                  user,
                  userBasicInfo,
                  setUserBasicInfo,
                }}
              >
                <OnlineUsersContext.Provider
                  value={{
                    firstOnlineUsers,
                    setFirstOnlineUsers,
                    setTotalOnlineUsers,
                    totalOnlineUsers,
                  }}
                >
                  <div className="screen-container column">
                    {!(window.screen.width < 940) ? (
                      <Header />
                    ) : (
                      <MobileHeader />
                    )}

                    <div className="flex grow overflow-hidden">
                      {window.screen.width > 940 && <Sidebar />}

                      {!loading && (
                        <Suspense
                          fallback={
                            <div className="flex grow justify-center bg-blue-2">
                              <LoadingHeart />
                            </div>
                          }
                        >
                          <Hydrate>
                            <div className="flex flex-col grow overflow-hidden p-8">
                              {children}
                            </div>
                            <ReactQueryDevtools initialIsOpen={false} />
                          </Hydrate>
                        </Suspense>
                      )}
                    </div>
                  </div>
                </OnlineUsersContext.Provider>
              </UserContext.Provider>
            </QueryClientProvider>
          </ConfigProvider>
        </RootStyleRegistry>
      </body>
    </html>
  );
}
