import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { Button, Space } from "antd";

import Page from "../../../components/containers/Page";

import { handleVerifyEmail } from "./util";

function VerifiedEmail() {
  const [verifiedSuccessfully, setVerifiedSuccessly] = useState(false);
  const [errorMessage, setErrorMessage] = useState(false);

  const location = useLocation();
  let { search } = location;
  const navigate = useNavigate();

  useEffect(() => {
    if (!search) return;
    const oobCode = /oobCode=([^&]+)/.exec(search)[1];

    handleVerifyEmail(navigate, oobCode, setErrorMessage, setVerifiedSuccessly);
  }, [navigate, search]);

  return (
    <Page className="column bg-blue-2" description="" title="Email Verified">
      <Space align="center" className="py32" direction="vertical">
        <Space
          align="center"
          className="container large bg-white pa16 br8"
          direction="vertical"
          size="small"
        >
          <Space direction="vertical">
            <h1 className="tac">
              {!errorMessage
                ? verifiedSuccessfully
                  ? "Email Verified successfully :)"
                  : "Loading"
                : "Please try again :'("}
            </h1>

            <p className="tac mb16">
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
