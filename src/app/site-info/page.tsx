"use client";
import React, { useState } from "react";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

import KarmaBadge from "../../components/views/KarmaBadge";
import SubscribeColumn from "../../components/SubscribeColumn";
import Container from "@/components/containers/Container/Container";
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
    <Page className="pa16">
      <Container>
        <Container className="flex-fill column bg-white br8 gap16 pa32">
          <Container className="column gap8">
            <h1 className="tac">Vent Online With People Who Care</h1>
            <p className="tac fw-400 mb16">
              People care and help is here. Vent and chat anonymously to be a
              part of a community committed to making the world a better place.
              This is a website for people that want to be heard and people that
              want to listen. Your mental health is our priority.
            </p>
          </Container>

          <Container className="column gap8">
            <Link href="/quote-contest">
              <h4>Daily Feel Good Quote Contest</h4>
            </Link>
            <p>
              Every day we display a feel good quote. The winner from this
              contest will be show cased for the following day. Submit your
              quote to potentially win.
            </p>
          </Container>

          <Container className="column gap8">
            <h4>What the Heck are Karma Points?</h4>
            <p>
              Karma Points are gained when your vent or comment gets upvoted or
              when you reach a new{" "}
              <Link className="blue" href="/rewards">
                milestone
              </Link>
              . Karma points will be lost if you are reported.
            </p>
          </Container>

          <Container className="column">
            <h4 className="tac">With Great Power Comes Great Responsibility</h4>
            <Container className="column gap8">
              <p className="tac">Click on a badge to learn more :)</p>
              <Container className="x-fill full-center wrap gap16">
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
              </Container>
              <Container className="column x-fill full-center pb16">
                <h6>{badgeDescriptions[activeBadge].title}</h6>
                <ul>
                  {badgeDescriptions[activeBadge].benefits.map(
                    (benefit, index) => (
                      <li key={index}>{benefit}</li>
                    )
                  )}
                </ul>
              </Container>
            </Container>
          </Container>

          <Container className="column gap8">
            <h4>What Can You Do on VWS?</h4>
            <ul className="pl64">
              <Container className="column gap8">
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
              </Container>
            </ul>
          </Container>

          <Container className="column gap8">
            <h4>How Do You Gain Karma Points?</h4>
            <ul className="pl64">
              <Container className="column gap8">
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
              </Container>
            </ul>
          </Container>

          <Container className="column gap8">
            <h4>If you have any issues please email us at</h4>
            <p>
              <a className="blue" href="mailto:ventwithstrangers@gmail.com">
                ventwithstrangers@gmail.com
              </a>
            </p>
          </Container>

          <Container className="column gap8">
            <h4>Where Else Can You Access VWS?</h4>
            <ul className="pl64">
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
          </Container>
          <h6 className="bold">Follow Us on Social Media!</h6>
          <Container className="gap16">
            <a
              className="button-4 fs-20 pb4"
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
                className="clickable common-border white round-icon round pa8"
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
                className="clickable common-border white round-icon round pa8"
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
                className="clickable common-border white round-icon round pa8"
                // @ts-ignore
                icon={faLinkedinIn}
                style={{
                  backgroundColor: "#0e76a8",
                }}
              />
            </a>
          </Container>
        </Container>
        <SubscribeColumn slot="1935732380" />
      </Container>
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
