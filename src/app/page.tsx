"use client";
import React, { useContext, useEffect, useState } from "react";
import Cookies from "universal-cookie";
import InfiniteScroll from "react-infinite-scroll-component";
import { Button, Space } from "antd";

import LoadingHeart from "../components/views/loaders/Heart";
import MakeAd from "../components/MakeAd/MakeAd";
import Page from "../components/containers/Page/Page";
import SubscribeColumn from "../components/SubscribeColumn";
import Vent from "../components/Vent/Vent";

import { UserContext } from "../context";

import { getVents, getWhatPage, newVentListener } from "./util";
import Link from "next/link";
import NewVentComponent from "@/components/NewVent/NewVent";

const cookies = new Cookies();

const VentsPage = () => {
  const { user } = useContext(UserContext);

  const [vents, setVents] = useState([]);
  const [waitingVents, setWaitingVents] = useState([]);
  const { pathname, search } = location;
  const [canLoadMore, setCanLoadMore] = useState(true);

  const [whatPage, setWhatPage] = useState<string>();

  useEffect(() => {
    const whatPage = getWhatPage(pathname);
    setWhatPage(whatPage);

    if (search) {
      const referral = /referral=([^&]+)/.exec(search)?.[1];
      if (referral) cookies.set("referral", referral);
    }

    let newVentListenerUnsubscribe: any;

    setWaitingVents([]);
    setVents([]);
    setCanLoadMore(true);

    getVents(setCanLoadMore, setVents, user, null, whatPage);
    newVentListenerUnsubscribe = newVentListener(setWaitingVents, whatPage);

    return () => {
      if (newVentListenerUnsubscribe) return newVentListenerUnsubscribe();
    };
  }, [pathname, search, setCanLoadMore, user]);

  return (
    <Page className="pa16" id="scrollable-div">
      <div className="flex grow w-full">
        <div className="flex flex-col grow gap-4">
          <NewVentComponent miniVersion />

          <div className="flex w-full full-center bg-white br8 gap-4 pa16">
            <Link className="grow" href="/recent">
              <h2
                className={
                  "button-3 fs-22 text-center " +
                  (whatPage === "recent" ? "active" : "")
                }
              >
                Recent
              </h2>
            </Link>

            {user && (
              <Link className="grow" href="/my-feed">
                <h2
                  className={
                    "button-3 fs-22 text-center " +
                    (whatPage === "my-feed" ? "active" : "")
                  }
                >
                  My Feed
                </h2>
              </Link>
            )}

            <Link className="grow" href="/trending">
              <h2
                className={
                  "button-3 fs-22 text-center " +
                  (whatPage === "trending" ||
                  whatPage === "trending-week" ||
                  whatPage === "trending-month"
                    ? "active"
                    : "")
                }
              >
                Trending
              </h2>
            </Link>
          </div>
          {(whatPage === "trending" ||
            whatPage === "trending-week" ||
            whatPage === "trending-month") && (
            <div className="w-full full-center bg-white br8 gap-4 pa16">
              <Link href="/trending">
                <h2
                  className={
                    "button-3 fs-22 text-center " +
                    (whatPage === "trending" ? "active" : "")
                  }
                >
                  Trending Today
                </h2>
              </Link>
              <Link href="/trending/this-week">
                <h2
                  className={
                    "button-3 fs-22 text-center " +
                    (whatPage === "trending-week" ? "active" : "")
                  }
                >
                  Trending This Week
                </h2>
              </Link>
              <Link href="/trending/this-month">
                <h2
                  className={
                    "button-3 fs-22 text-center " +
                    (whatPage === "trending-month" ? "active" : "")
                  }
                >
                  Trending This Month
                </h2>
              </Link>
            </div>
          )}

          {vents && (
            <InfiniteScroll
              dataLength={vents.length}
              endMessage={
                <p className="primary text-center mt16">
                  <b>Yay! You have seen it all</b>
                </p>
              }
              hasMore={canLoadMore}
              loader={
                <div className="w-full full-center">
                  <LoadingHeart />
                </div>
              }
              next={() =>
                getVents(setCanLoadMore, setVents, user, vents, whatPage)
              }
              scrollableTarget="scrollable-div"
            >
              <Space className="w-full" direction="vertical" size="large">
                {waitingVents.length > 0 && (
                  <Button
                    className="w-full "
                    onClick={() => {
                      setVents((vents) => [...waitingVents, ...vents]);
                      setWaitingVents([]);
                    }}
                    shape="round"
                    size="large"
                  >
                    Load New Vent{waitingVents.length > 1 ? "s" : ""}
                  </Button>
                )}
                {vents &&
                  vents.map((vent: any, index: number) => {
                    return (
                      <div className="flex flex-col w-full gap-2" key={vent.id}>
                        <Vent
                          previewMode={true}
                          ventID={vent.id}
                          ventInit={vent.title ? vent : undefined}
                        />
                        {index % 3 === 0 && (
                          <MakeAd
                            banner
                            layoutKey="-em+1v+cz-83-96"
                            slot="1835301248"
                          />
                        )}
                      </div>
                    );
                  })}
              </Space>
            </InfiniteScroll>
          )}
        </div>

        <SubscribeColumn slot="7871419499" />
      </div>
    </Page>
  );
};

export default VentsPage;
