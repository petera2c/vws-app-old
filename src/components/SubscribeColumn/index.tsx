import React, { useContext } from "react";

import Container from "../containers/Container";
import MakeAd from "../MakeAd";
import UniqueShareLink from "../views/UniqueShareLink";

import { UserContext } from "../../context";
import { getIsMobileOrTablet } from "../../util";

function SubscribeColumn({ slot, uniqueShareLink = true }) {
  const { user } = useContext(UserContext);

  if (!getIsMobileOrTablet())
    return (
      <Container className="container ad column pl16">
        <Container className="sticky top-0 column x-fill gap16">
          {uniqueShareLink && <UniqueShareLink user={user} />}
          <MakeAd slot={slot} />
        </Container>
      </Container>
    );
  else return <div style={{ display: "none" }} />;
}

export default SubscribeColumn;

/*{user && !uniqueShareLink && (
  <Space
    className="x-fill full-center bg-white pa16 br8"
    direction="vertical"
  >
    <h4 className="tac">Become a Subscriber</h4>
    <p className="tac">
      Vent With Strangers needs your help. Support our team to build
      the application our community needs. Please consider
      subscribing.
    </p>
    <Link href="/subscribe">
      <Button size="large" type="primary">
        Subscribe For $1/Month
      </Button>
    </Link>
  </Space>
)}*/
