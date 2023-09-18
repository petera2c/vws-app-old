import React, { useContext } from "react";

import MakeAd from "./MakeAd/MakeAd";
import UniqueShareLink from "./views/UniqueShareLink/UniqueShareLink";

import { UserContext } from "../context";
import { useIsMobileOrTablet } from "../util";

function SubscribeColumn({
  slot,
  uniqueShareLink = true,
}: {
  slot: string;
  uniqueShareLink?: boolean;
}) {
  const { user } = useContext(UserContext);
  const isMobileOrTablet = useIsMobileOrTablet();

  if (!isMobileOrTablet)
    return (
      <div className="container ad flex flex-col pl-4">
        <div className="sticky top-0 flex flex-col w-full gap-4">
          {uniqueShareLink && <UniqueShareLink user={user} />}
          <MakeAd slot={slot} />
        </div>
      </div>
    );
  else return <div style={{ display: "none" }} />;
}

export default SubscribeColumn;

/*{user && !uniqueShareLink && (
  <Space
    className="flex full-center w-full bg-white p-4 br8"
    direction="vertical"
  >
    <h4 className="text-center">Become a Subscriber</h4>
    <p className="text-center">
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
