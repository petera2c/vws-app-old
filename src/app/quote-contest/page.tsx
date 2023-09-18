"use client";
import React, { useContext, useEffect, useState } from "react";
import dayjs from "dayjs";
import { Button, message } from "antd";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

import Options from "../../components/Options";
import SubscribeColumn from "../../components/SubscribeColumn";

import { UserContext } from "../../context";

import {
  calculateKarma,
  capitolizeFirstChar,
  countdown,
  formatSeconds,
  getUserBasicInfo,
  hasUserBlockedUser,
  useIsMobileOrTablet,
  userSignUpProgress,
} from "../../util";
import {
  deleteQuote,
  getCanUserCreateQuote,
  getHasUserLikedQuote,
  getQuotes,
  likeOrUnlikeQuote,
  reportQuote,
  saveQuote,
} from "./util";
import Page from "@/components/containers/Page/Page";
import Quote from "@/types/Quote";
import Link from "next/link";
import {
  faChevronCircleUp,
  faQuoteLeft,
} from "@fortawesome/free-solid-svg-icons";
import UserBasicInfo from "@/types/UserBasicInfo";
import TextArea from "antd/es/input/TextArea";

function QuoteContestPage() {
  const { user, userBasicInfo } = useContext(UserContext);
  const isMobileOrTablet = useIsMobileOrTablet();

  const [canLoadMoreQuotes, setCanLoadMoreQuotes] = useState(true);
  const [canUserCreateQuote, setCanUserCreateQuote] = useState(true);
  const [contestTimeLeft, setContestTimeLeft] = useState();
  const [myQuote, setMyQuote] = useState("");
  const [quoteID, setQuoteID] = useState<string>();
  const [quotes, setQuotes] = useState([]);
  const [starterModal, setStarterModal] = useState<boolean>();

  useEffect(() => {
    if (user) getCanUserCreateQuote(setCanUserCreateQuote, user.uid);
    getQuotes(setCanLoadMoreQuotes, setQuotes);
    let timeLeftDayjs = dayjs().utcOffset(0).add(1, "day");
    timeLeftDayjs = timeLeftDayjs.set("hour", 0);
    timeLeftDayjs = timeLeftDayjs.set("minute", 0);
    timeLeftDayjs = timeLeftDayjs.set("hour", 0);
    timeLeftDayjs = timeLeftDayjs.set("hour", 0);

    countdown(timeLeftDayjs, setContestTimeLeft);
    let interval = setInterval(
      () => countdown(timeLeftDayjs, setContestTimeLeft),
      1000
    );

    return () => {
      clearInterval(interval);
    };
  }, [user]);

  return (
    <Page className="p-4">
      <div className="flex gap-2" style={{ height: "100%" }}>
        <div className="flex flex-col grow">
          <div className="flex flex-col grow overflow-hidden bg-white br8">
            <div className="flex flex-col grow overflow-auto gap-2 pt-2 px-4">
              <div className="flex flex-col border-bottom gap-2 px-4 pb-4">
                <h1 className="text-center">Feel Good Quote Contest</h1>
                <div className="flex flex-col gap-1">
                  <p className="text-center">
                    Every day we display a feel good quote. The winner from this
                    contest will be show cased for the following day
                  </p>
                  <p className="text-center lh-1">
                    Time left in contest: {formatSeconds(contestTimeLeft)}
                  </p>
                </div>
              </div>
              {quotes.map((quote: Quote, index) => {
                return (
                  <Quote
                    isLast={index === quotes.length - 1}
                    key={index}
                    quote1={quote}
                    setCanUserCreateQuote={setCanUserCreateQuote}
                    setMyQuote={setMyQuote}
                    setQuoteID={setQuoteID}
                    setQuotes={setQuotes}
                    setStarterModal={setStarterModal}
                    user={user}
                  />
                );
              })}
              {canLoadMoreQuotes && (
                <Button
                  onClick={() =>
                    getQuotes(setCanLoadMoreQuotes, setQuotes, quotes)
                  }
                  type="primary"
                >
                  Load More Quotes
                </Button>
              )}
            </div>

            <div
              className={
                "flex w-full shadow-2 gap-2 p-4 " +
                (isMobileOrTablet ? "flex-col" : "items-center")
              }
            >
              <TextArea
                className="grow py-2 px-4 br4"
                onChange={(event) => {
                  const userInteractionIssues = userSignUpProgress(user);

                  if (userInteractionIssues) {
                    if (userInteractionIssues === "NSI")
                      return setStarterModal(true);
                  }
                  if (userInteractionIssues) return;

                  if (calculateKarma(userBasicInfo) < 20)
                    return message.info(
                      "You need 20 karma points to interact with this :)"
                    );

                  if (!event.target.value && quoteID) setQuoteID(undefined);
                  setMyQuote(event.target.value);
                }}
                placeholder="Change someone's day :)"
                value={myQuote}
              />
              <Button
                onClick={() => {
                  const userInteractionIssues = userSignUpProgress(user);

                  if (userInteractionIssues) {
                    if (userInteractionIssues === "NSI")
                      return setStarterModal(true);
                  }

                  if (myQuote)
                    saveQuote(
                      canUserCreateQuote,

                      myQuote,
                      quoteID!,
                      setCanUserCreateQuote,
                      setMyQuote,
                      setQuotes,
                      user!.uid
                    );
                }}
                size="large"
                type="primary"
              >
                Submit My Quote
              </Button>
            </div>
          </div>
        </div>
        <SubscribeColumn slot="1425588771" />
      </div>
    </Page>
  );
}

const Quote = ({
  isLast,
  quote1,
  setCanUserCreateQuote,
  setMyQuote,
  setQuoteID,
  setQuotes,
  setStarterModal,
  user,
}: {
  isLast: boolean;
  quote1: Quote;
  setCanUserCreateQuote: any;
  setMyQuote: any;
  setQuoteID: any;
  setQuotes: any;
  setStarterModal: any;
  user: any;
}) => {
  const [author, setAuthor] = useState<UserBasicInfo>();
  const [hasLiked, setHasLiked] = useState<boolean>();
  const [isContentBlocked, setIsContentBlocked] = useState();
  const [quote, setQuote] = useState(quote1);

  useEffect(() => {
    getUserBasicInfo((author: any) => {
      setAuthor(author);
    }, quote.userID);

    if (user) {
      hasUserBlockedUser(user.uid, quote.userID, setIsContentBlocked);
      getHasUserLikedQuote(
        quote.id,
        (hasLiked: boolean) => {
          setHasLiked(hasLiked);
        },
        user.uid
      );
    }
  }, [quote.id, quote.userID, user]);

  if (isContentBlocked) return <div />;

  return (
    <div className={"py-2 " + (isLast ? "" : "border-bottom")}>
      <div className="flex items-center grow gap-4">
        <FontAwesomeIcon className="blue" icon={faQuoteLeft} size="3x" />
        <div className="flex flex-col grow items-center gap-2">
          <p className="italic text-center">{quote.value}</p>
          <Link href={"/profile?" + quote.userID}>
            <p className="blue text-center">
              - {capitolizeFirstChar(author?.displayName)}
            </p>
          </Link>
        </div>
      </div>
      <div className="gap-2">
        <div className="items-end">
          <h4 className="grey-5" style={{ lineHeight: 1.1 }}>
            {quote.like_counter ? quote.like_counter : 0}
          </h4>
        </div>

        <div
          className={
            "flex flex-col items-center gap-1 " +
            (user ? "justify-between " : "justify-end")
          }
        >
          {user && (
            <Options
              canUserInteractFunction={
                userSignUpProgress(user, true)
                  ? () => {
                      const userInteractionIssues = userSignUpProgress(user);

                      if (userInteractionIssues) {
                        if (userInteractionIssues === "NSI")
                          return setStarterModal(true);
                      }
                    }
                  : false
              }
              deleteFunction={(quoteID: string) =>
                deleteQuote(
                  quoteID,
                  setCanUserCreateQuote,
                  setQuoteID,
                  setQuotes
                )
              }
              editFunction={() => {
                setQuoteID(quote.id);
                setMyQuote(quote.value);
              }}
              objectID={quote.id}
              objectUserID={quote.userID}
              reportFunction={(option: any) => {
                reportQuote(option, quote.id, user.uid);
              }}
              userID={user.uid}
            />
          )}

          <FontAwesomeIcon
            className={`cursor-pointer button-8 ${
              hasLiked ? "blue" : "grey-5"
            }`}
            icon={faChevronCircleUp}
            onClick={async () => {
              const userInteractionIssues = userSignUpProgress(user);

              if (userInteractionIssues) {
                if (userInteractionIssues === "NSI") setStarterModal(true);
                return;
              }

              await likeOrUnlikeQuote(hasLiked!, quote, user);

              await getHasUserLikedQuote(quote.id, setHasLiked, user.uid);

              if (!quote.like_counter) quote.like_counter = 0;
              if (hasLiked) quote.like_counter--;
              else quote.like_counter++;

              setQuote({ ...quote });
            }}
            size="2x"
          />
        </div>
      </div>
    </div>
  );
};

export default QuoteContestPage;
