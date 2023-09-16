"use client";
import React, { useState } from "react";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

import KarmaBadge from "../../components/views/KarmaBadge";
import SubscribeColumn from "../../components/SubscribeColumn";
import Page from "@/components/containers/Page/Page";
import Link from "next/link";
import {
  faFacebook,
  faInstagram,
  faLinkedin,
  faLinkedinIn,
} from "@fortawesome/free-brands-svg-icons";

function AboutUsPage() {
  const [activeBadge, setActiveBadge] = useState(0);

  return (
    <Page className="p-4">
      <div className="flex">
        <div className="flex flex-col grow bg-white br8 gap-4 p-8">
          <div className="flex flex-col gap-2">
            <h1 className="text-center">Vent Online With People Who Care</h1>
            <p className="text-center fw-400 mb-4">
              People care and help is here. Vent and chat anonymously to be a
              part of a community committed to making the world a better place.
              This is a website for people that want to be heard and people that
              want to listen. Your mental health is our priority.
            </p>
          </div>

          <div className="flex flex-col gap-2">
            <Link href="/quote-contest">
              <h4>Daily Feel Good Quote Contest</h4>
            </Link>
            <p>
              Every day we display a feel good quote. The winner from this
              contest will be show cased for the following day. Submit your
              quote to potentially win.
            </p>
          </div>

          <div className="flex flex-col gap-2">
            <h4>What the Heck are Karma Points?</h4>
            <p>
              Karma Points are gained when your vent or comment gets upvoted or
              when you reach a new{" "}
              <Link className="blue" href="/rewards">
                milestone
              </Link>
              . Karma points will be lost if you are reported.
            </p>
          </div>

          <div className="flex flex-col">
            <h4 className="text-center">
              With Great Power Comes Great Responsibility
            </h4>
            <div className="flex flex-col gap-2">
              <p className="text-center">Click on a badge to learn more :)</p>
              <div className="flex full-center flex-wrap w-full gap-4">
                <KarmaBadge
                  onClick={() => setActiveBadge(0)}
                  userBasicInfo={{ karma: 50 }}
                />
                <KarmaBadge
                  onClick={() => setActiveBadge(1)}
                  userBasicInfo={{ karma: 100 }}
                />
                <KarmaBadge
                  onClick={() => setActiveBadge(2)}
                  userBasicInfo={{ karma: 250 }}
                />
                <KarmaBadge
                  onClick={() => setActiveBadge(3)}
                  userBasicInfo={{ karma: 500 }}
                />
                <KarmaBadge
                  onClick={() => setActiveBadge(4)}
                  userBasicInfo={{ karma: 1000 }}
                />
                <KarmaBadge
                  onClick={() => setActiveBadge(5)}
                  userBasicInfo={{ karma: 2500 }}
                />
                <KarmaBadge
                  onClick={() => setActiveBadge(6)}
                  userBasicInfo={{ karma: 5000 }}
                />
                <KarmaBadge
                  onClick={() => setActiveBadge(7)}
                  userBasicInfo={{ karma: 10000 }}
                />
              </div>
              <div className="flex flex-col w-full full-center pb-4">
                <h6>{badgeDescriptions[activeBadge].title}</h6>
                <ul>
                  {badgeDescriptions[activeBadge].benefits.map(
                    (benefit, index) => (
                      <li key={index}>{benefit}</li>
                    )
                  )}
                </ul>
              </div>
            </div>
          </div>

          <div className="flex flex-col gap-2">
            <h4>What Can You Do on VWS?</h4>
            <ul className="pl-16">
              <div className="flex flex-col gap-2">
                <li>Chat anonymously with strangers</li>
                <li>
                  <Link
                    className="no-bold a-tag-common-link"
                    href="/vent-to-strangers"
                  >
                    Create vents anonymously
                  </Link>
                </li>
                <li>Comment on vents anonymously</li>
                <li>
                  Tag someone in a post or comment by placing @ before their
                  username
                </li>
                <li>Earn Karma Points</li>
              </div>
            </ul>
          </div>

          <div className="flex flex-col gap-2">
            <h4>How Do You Gain Karma Points?</h4>
            <ul className="pl-16">
              <div className="flex flex-col gap-2">
                <li>
                  <span className="green">+4</span> For an upvote on your
                  comment
                </li>
                <li>
                  <span className="green">+4</span> For an upvote on your vent
                </li>
                <li>
                  However, the best way to earn karma is through{" "}
                  <Link className="blue" href="/rewards">
                    Rewards
                  </Link>
                </li>
                <li>
                  <span className="red">- 30</span> When you get reported (for a
                  valid reason)
                </li>
              </div>
            </ul>
          </div>

          <div className="flex flex-col gap-2">
            <h4>If you have any issues please email us at</h4>
            <p>
              <a className="blue" href="mailto:ventwithstrangers@gmail.com">
                ventwithstrangers@gmail.com
              </a>
            </p>
          </div>

          <div className="flex flex-col gap-2">
            <h4>Where Else Can You Access VWS?</h4>
            <ul className="pl-16">
              <li>
                <a
                  className="underline no-bold a-tag-common-link"
                  href="https://apps.apple.com/us/app/vent-with-strangers/id1509120090"
                >
                  Apple App Store
                </a>
              </li>
              <li>
                <a
                  className="underline no-bold a-tag-common-link"
                  href="https://play.google.com/store/apps/details?id=com.commontech.ventwithstrangers&hl=en"
                >
                  Google Play Store
                </a>
              </li>
            </ul>
          </div>
          <h6 className="bold">Follow Us on Social Media!</h6>
          <div className="gap-4">
            <a
              className="button-4 fs-20 pb-1"
              href="https://blog.ventwithstrangers.com"
              rel="noopener noreferrer"
              target="_blank"
            >
              VWS Blog
            </a>
            <a
              href="https://www.instagram.com/ventwithstrangers/"
              rel="noopener noreferrer"
              target="_blank"
            >
              <FontAwesomeIcon
                className="cursor-pointer common-border white round-icon round p-2"
                // @ts-ignore
                icon={faInstagram}
                style={{
                  backgroundColor: "#cd486b",
                }}
              />
            </a>
            <a
              href="https://www.facebook.com/ventwithstrangers"
              rel="noopener noreferrer"
              target="_blank"
            >
              <FontAwesomeIcon
                className="cursor-pointer common-border white round-icon round p-2"
                // @ts-ignore
                icon={faFacebook}
                style={{
                  backgroundColor: "#3b5998",
                }}
              />
            </a>
            <a
              href="https://www.linkedin.com/company/vent-with-strangers/"
              rel="noopener noreferrer"
              target="_blank"
            >
              <FontAwesomeIcon
                className="cursor-pointer common-border white round-icon round p-2"
                // @ts-ignore
                icon={faLinkedinIn}
                style={{
                  backgroundColor: "#0e76a8",
                }}
              />
            </a>
          </div>
        </div>
        <SubscribeColumn slot="1935732380" />
      </div>
    </Page>
  );
}

const badgeDescriptions = [
  {
    benefits: ["Can create a vent once every 4 hours"],
    title: "Basic Orange Badge",
  },
  {
    benefits: ["Can create a vent once every 3 hours"],
    title: "Basic Red Badge",
  },
  {
    benefits: ["Can create a vent once every 2 hours"],
    title: "Basic Green Badge",
  },
  {
    benefits: ["Can create a vent once every 1 hour"],
    title: "Basic Blue Badge",
  },
  {
    benefits: ["Can create a vent once every 1 hour"],
    title: "Super Orange Badge",
  },
  {
    benefits: ["Can create a vent once every 1 hour"],
    title: "Super Red Badge",
  },
  {
    benefits: ["Can create a vent once every 1 hour"],
    title: "Super Green Badge",
  },
  {
    benefits: ["Can create a vent once every 1 hour"],
    title: "Super Blue Badge",
  },
];

export default AboutUsPage;
