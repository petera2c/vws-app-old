"use client";
import React, { useContext, useEffect, useState } from "react";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import { Progress, Tooltip } from "antd";

import { UserContext } from "../../context";

import { getIsMobileOrTablet } from "../../util";
import {
  calculateMilestone,
  getNextMilestone,
  getUserRecentRewards,
  getUserRewardsProgress,
} from "./util";
import Page from "@/components/containers/Page/Page";
import Reward from "@/types/Reward";

dayjs.extend(relativeTime);

function RewardsPage() {
  const { user } = useContext(UserContext);

  const [isMobileOrTablet, setIsMobileOrTablet] = useState<boolean>();
  const [recentRewards, setRecentRewards] = useState<Reward[]>([]);
  const [userRewards, setUserRewards] = useState<Reward>();

  useEffect(() => {
    setIsMobileOrTablet(getIsMobileOrTablet());

    if (user) {
      getUserRecentRewards(setRecentRewards, user.uid);
      getUserRewardsProgress(setUserRewards, user.uid);
    }
  }, [user]);

  return (
    <Page className="pa16">
      <div className="flex flex-col grow">
        <div className="flex flex-col bg-white pa32 br8">
          <h1 className="text-center mb32">Your Upcoming Rewards</h1>
          <div
            className="grid gap-8"
            style={{ gridTemplateColumns: "1fr 1fr 1fr" }}
          >
            <CounterDisplay
              counter={userRewards?.created_vents_counter}
              size="small"
              tooltip="The total number of vents you have created :)"
              title="Vents Created"
            />
            <CounterDisplay
              counter={userRewards?.created_vent_supports_counter}
              size="medium"
              tooltip="The total number of vents you have supported :)"
              title="Vents You Supported"
            />
            <CounterDisplay
              counter={userRewards?.received_vent_supports_counter}
              size="medium"
              tooltip="The total number of supports received on your vents :)"
              title="Vent Supports Received"
            />
            <CounterDisplay
              counter={userRewards?.created_comments_counter}
              size="small"
              tooltip="The total number of comments you have created :)"
              title="Comments Created"
            />
            <CounterDisplay
              counter={userRewards?.created_comment_supports_counter}
              size="medium"
              tooltip="The total number of comments you have supported :)"
              title="Comments You Supported"
            />
            <CounterDisplay
              counter={userRewards?.received_comment_supports_counter}
              size="medium"
              tooltip="The total number of supports received on your comments :)"
              title="Comment Supports Received"
            />
            <CounterDisplay
              counter={userRewards?.created_quotes_counter}
              size="small"
              tooltip="The total number of quotes you have created :)"
              title="Quotes Created"
            />
            <CounterDisplay
              counter={userRewards?.created_quote_supports_counter}
              size="medium"
              tooltip="The total number of quotes you have supported :)"
              title="Quotes You Supported"
            />
            <CounterDisplay
              counter={userRewards?.received_quote_supports_counter}
              size="medium"
              tooltip="The total number of supports received on your quotes :)"
              title="Quote Supports Received"
            />
            <CounterDisplay
              counter={userRewards?.quote_contests_won_counter}
              size="tiny"
              tooltip="The total number of quote contests you have won :)"
              title="Quote Contests Won"
            />
          </div>
        </div>
        <div className="flex flex-col gap-2">
          <h1>Recent Rewards</h1>
          {recentRewards.map((obj, index) => (
            <div className="flex flex-col w-full bg-white pa16 br8" key={index}>
              <h6>{obj.title}</h6>
              <p className="blue">+ {obj.karma_gained} Karma Points</p>
              <p>{dayjs(obj.server_timestamp).fromNow()}</p>
            </div>
          ))}
        </div>
      </div>
    </Page>
  );
}

const CounterDisplay = ({
  counter = 0,
  size,
  tooltip,
  title,
}: {
  counter?: number;
  size: "tiny" | "small" | "medium" | "large";
  tooltip: string;
  title: string;
}) => {
  return (
    <div className="w-full">
      <div className="flex items-center">
        <h4>
          {counter}/{getNextMilestone(counter, size)}
        </h4>
        <Tooltip placement="bottom" title={tooltip}>
          <h6 className="blue">{title}</h6>
        </Tooltip>
      </div>
      <Progress
        percent={Math.floor((counter / getNextMilestone(counter, size)) * 100)}
        strokeColor="#2096f2"
      />
      <Tooltip
        placement="bottom"
        title="The amount of karma you will receive after reaching your next milestone :)"
      >
        <p className="flex justify-end" style={{ lineHeight: 1.25 }}>
          {calculateMilestone(counter, size)} Karma Points
        </p>
      </Tooltip>
    </div>
  );
};

export default RewardsPage;
