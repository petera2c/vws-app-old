"use client";
import React, { useEffect, useState } from "react";
import dayjs from "dayjs";

import {
  capitolizeFirstChar,
  getUserBasicInfo,
  useIsMounted,
} from "../../util";
import { getQuotes } from "./util";
import Page from "@/components/containers/Page/Page";
import Container from "@/components/containers/Container/Container";
import UserBasicInfo from "@/types/UserBasicInfo";
import Quote from "@/types/Quote";
import Link from "next/link";

function QuoteWinnersPage() {
  const isMounted = useIsMounted();

  const [quotes, setQuotes] = useState<Quote[]>([]);
  const [thisMonthYearFormatted, setThisMonthYearFormatted] = useState<any>();

  useEffect(() => {
    if (isMounted()) setThisMonthYearFormatted(dayjs().format("MMMM YYYY"));
    getQuotes(isMounted, setQuotes);
  }, [isMounted, setQuotes]);

  return (
    <Page className="align-center gap16 pa32">
      <Container className="column bg-white br8 gap16 pa32">
        <h1 className="tac lh-1">{thisMonthYearFormatted} Feel Good Quotes</h1>
        <Container className="column">
          <h2 className="fs-22 grey-1 tac">Some of our favourites :)</h2>
        </Container>
      </Container>

      <Container className="justify-center x-fill wrap gap16">
        {quotes.map((quote) => (
          <QuoteDisplay key={quote.id} quote={quote} />
        ))}
      </Container>
    </Page>
  );
}

function QuoteDisplay({ quote }: { quote: Quote }) {
  const isMounted = useIsMounted();
  const [userBasicInfo, setUserBasicInfo] = useState<UserBasicInfo>();

  useEffect(() => {
    getUserBasicInfo((userBasicInfo: UserBasicInfo) => {
      if (isMounted()) setUserBasicInfo(userBasicInfo);
    }, quote.userID);
  }, [isMounted, quote, setUserBasicInfo]);

  return (
    <Container className="column x-fill bg-white br8 gap8 pa16">
      <p className="italic primary fs-20 tac">
        "{capitolizeFirstChar(quote.value)}"
      </p>
      <Link className="button-8 fs-20 tac" href={"/profile?" + quote.userID}>
        - {capitolizeFirstChar(userBasicInfo?.displayName)}
      </Link>
      <p className="tar">
        {dayjs(quote.server_timestamp).format("MMMM DD, YYYY")}
      </p>
    </Container>
  );
}

export default QuoteWinnersPage;
