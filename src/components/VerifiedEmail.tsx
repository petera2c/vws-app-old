import React, { useEffect, useState } from "react";
import { Button, Space } from "antd";

import { handleVerifyEmail } from "./util";
import { useRouter, useSearchParams } from "next/navigation";
import Page from "./containers/Page/Page";

function VerifiedEmail() {
  const [verifiedSuccessfully, setVerifiedSuccessly] = useState(false);
  const [errorMessage, setErrorMessage] = useState(false);

  const searchParams = useSearchParams();
  const search = searchParams.toString();
  const router = useRouter();

  useEffect(() => {
    if (!search) return;
    const oobCode = /oobCode=([^&]+)/.exec(search.toString())?.[1];

    handleVerifyEmail(
      router.push,
      oobCode,
      setErrorMessage,
      setVerifiedSuccessly
    );
  }, [router.push, search]);

  return (
    <Page
      className="flex flex-col bg-blue-2"
      description=""
      title="Email Verified"
    >
      <Space align="center" className="py-8" direction="vertical">
        <Space
          align="center"
          className="container large bg-white p-4 br8"
          direction="vertical"
          size="small"
        >
          <Space direction="vertical">
            <h1 className="text-center">
              {!errorMessage
                ? verifiedSuccessfully
                  ? "Email Verified successfully :)"
                  : "Loading"
                : "Please try again :'("}
            </h1>

            <p className="text-center mb-4">
              {!errorMessage
                ? verifiedSuccessfully
                  ? "Click continue' to go home!"
                  : "Loading"
                : errorMessage}
            </p>
          </Space>
          {verifiedSuccessfully && (
            <Button href="/" size="large" type="primary">
              Continue
            </Button>
          )}
        </Space>
      </Space>
    </Page>
  );
}

export default VerifiedEmail;
