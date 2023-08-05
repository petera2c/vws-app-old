"use client";
import React from "react";
import { Button } from "antd";
import Link from "next/link";
import Page from "@/components/containers/Page/Page";

const NotFoundPage = () => {
  return (
    <Page
      className="align-center bg-blue-2 gap32 pt64"
      description="Page not found."
      keywords=""
      title="Not Found"
    >
      <h1 className="tac lh-1">Page Not Found :(</h1>
      <Link href="/">
        <Button size="large" type="primary">
          Go Home
        </Button>
      </Link>
    </Page>
  );
};

export default NotFoundPage;
