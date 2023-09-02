"use client";
import React, { useEffect, useState } from "react";
import dayjs from "dayjs";

import { capitolizeFirstChar, getUserBasicInfo } from "../../util";
import { getQuotes } from "./util";
import Page from "@/components/containers/Page/Page";
import UserBasicInfo from "@/types/UserBasicInfo";
import Quote from "@/types/Quote";
import Link from "next/link";

function QuoteWinnersPage() {
  const [quotes, setQuotes] = useState<Quote[]>([]);
  const [thisMonthYearFormatted, setThisMonthYearFormatted] = useState<any>();

  useEffect(() => {
    setThisMonthYearFormatted(dayjs().format("MMMM YYYY"));
    getQuotes(setQuotes);
  }, [setQuotes]);

  return (
    <Page className="items-center gap16 pa32">
      <div className="flex flex-col bg-white br8 gap16 pa32">
        <h1 className="text-center lh-1">
          {thisMonthYearFormatted} Feel Good Quotes
        </h1>
        <div className="flex flex-col">
          <h2 className="fs-22 grey-1 text-center">
            Some of our favourites :)
          </h2>
        </div>
      </div>

      <div className="justify-center w-full wrap gap16">
        {quotes.map((quote) => (
          <QuoteDisplay key={quote.id} quote={quote} />
        ))}
      </div>
    </Page>
  );
}

function QuoteDisplay({ quote }: { quote: Quote }) {
  const [userBasicInfo, setUserBasicInfo] = useState<UserBasicInfo>();

  useEffect(() => {
    getUserBasicInfo((userBasicInfo: UserBasicInfo) => {
      setUserBasicInfo(userBasicInfo);
    }, quote.userID);
  }, [quote, setUserBasicInfo]);

  return (
    <div className="flex flex-col w-full bg-white br8 gap8 pa16">
      <p className="italic primary fs-20 text-center">
        "{capitolizeFirstChar(quote.value)}"
      </p>
      <Link
        className="button-8 fs-20 text-center"
        href={"/profile?" + quote.userID}
      >
        - {capitolizeFirstChar(userBasicInfo?.displayName)}
      </Link>
      <p className="tar">
        {dayjs(quote.server_timestamp).format("MMMM DD, YYYY")}
      </p>
    </div>
  );
}

export default QuoteWinnersPage;
