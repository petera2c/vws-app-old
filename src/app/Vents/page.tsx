"use client";
import React, { useContext, useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import Cookies from "universal-cookie";
import InfiniteScroll from "react-infinite-scroll-component";
import { Button, Space } from "antd";

import Container from "../../components/containers/Container";
import LoadingHeart from "../../components/views/loaders/Heart";
import MakeAd from "../../components/MakeAd";
import NewVentComponent from "../../components/NewVent";
import Page from "../../components/containers/Page";
import SubscribeColumn from "../../components/SubscribeColumn";
import Vent from "../../components/Vent";

import { UserContext } from "../../context";

import { useIsMounted } from "../../util";
import { getVents, getWhatPage, newVentListener } from "./util";

const cookies = new Cookies();

function VentsPage() {
  const isMounted = useIsMounted();
  const location = useLocation();

  const { user } = useContext(UserContext);

  const [vents, setVents] = useState([]);
  const [waitingVents, setWaitingVents] = useState([]);
  const { pathname, search } = location;
  const [canLoadMore, setCanLoadMore] = useState(true);

  const [whatPage, setWhatPage] = useState();

  useEffect(() => {
    const whatPage = getWhatPage(pathname);
    setWhatPage(whatPage);

    if (search) {
      const referral = /referral=([^&]+)/.exec(search)[1];
      if (referral) cookies.set("referral", referral);
    }

    let newVentListenerUnsubscribe;

    setWaitingVents([]);
    setVents([]);
    setCanLoadMore(true);

    getVents(isMounted, setCanLoadMore, setVents, user, null, whatPage);
    newVentListenerUnsubscribe = newVentListener(
      isMounted,
      setWaitingVents,
      whatPage
    );

    return () => {
      if (newVentListenerUnsubscribe) return newVentListenerUnsubscribe();
    };
  }, [isMounted, pathname, search, setCanLoadMore, user]);

  return (
    <Page className="pa16" id="scrollable-div">
      <Container className="flex-fill x-fill">
        <Container className="column flex-fill gap16">
          <NewVentComponent miniVersion />

          <Container className="x-fill full-center bg-white br8 gap16 pa16">
            <Link className="flex-fill" to="/recent">
              <h2
                className={
                  "button-3 fs-22 tac " +
                  (whatPage === "recent" ? "active" : "")
                }
              >
                Recent
              </h2>
            </Link>

            {user && (
              <Link className="flex-fill" to="/my-feed">
                <h2
                  className={
                    "button-3 fs-22 tac " +
                    (whatPage === "my-feed" ? "active" : "")
                  }
                >
                  My Feed
                </h2>
              </Link>
            )}

            <Link className="flex-fill" to="/trending">
              <h2
                className={
                  "button-3 fs-22 tac " +
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
          </Container>
          {(whatPage === "trending" ||
            whatPage === "trending-week" ||
            whatPage === "trending-month") && (
            <Container className="x-fill full-center bg-white br8 gap16 pa16">
              <Link to="/trending">
                <h2
                  className={
                    "button-3 fs-22 tac " +
                    (whatPage === "trending" ? "active" : "")
                  }
                >
                  Trending Today
                </h2>
              </Link>
              <Link to="/trending/this-week">
                <h2
                  className={
                    "button-3 fs-22 tac " +
                    (whatPage === "trending-week" ? "active" : "")
                  }
                >
                  Trending This Week
                </h2>
              </Link>
              <Link to="/trending/this-month">
                <h2
                  className={
                    "button-3 fs-22 tac " +
                    (whatPage === "trending-month" ? "active" : "")
                  }
                >
                  Trending This Month
                </h2>
              </Link>
            </Container>
          )}

          {vents && (
            <InfiniteScroll
              dataLength={vents.length}
              endMessage={
                <p className="primary tac mt16">
                  <b>Yay! You have seen it all</b>
                </p>
              }
              hasMore={canLoadMore}
              loader={
                <Container className="x-fill full-center">
                  <LoadingHeart />
                </Container>
              }
              next={() =>
                getVents(
                  isMounted,
                  setCanLoadMore,
                  setVents,
                  user,
                  vents,
                  whatPage
                )
              }
              scrollableTarget="scrollable-div"
            >
              <Space className="x-fill" direction="vertical" size="large">
                {waitingVents.length > 0 && (
                  <Button
                    className="x-fill "
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
                  vents.map((vent, index) => {
                    return (
                      <Container className="column x-fill gap8" key={vent.id}>
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
                      </Container>
                    );
                  })}
              </Space>
            </InfiniteScroll>
          )}
        </Container>

        <SubscribeColumn slot="7871419499" />
      </Container>
    </Page>
  );
}

export default VentsPage;
