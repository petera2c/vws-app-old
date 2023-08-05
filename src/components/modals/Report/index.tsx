import React, { Component, useState } from "react";

import Container from "../../containers/Container/Container";

const ReportModal = ({ close, submit }: any) => {
  const [abuse, setAbuse] = useState<boolean>();
  const [illegal, setIllegal] = useState<boolean>();
  const [malicious, setMalicious] = useState<boolean>();
  const [option, setOption] = useState<string>();
  const [privateInformation, setPrivateInformation] = useState<boolean>();
  const [violence, setViolence] = useState<boolean>();
  const [somethingChanged, setSomethingChanged] = useState<boolean>();
  const handleChange = (stateObj: any) => {
    const stateObj2: any = {
      abuse: false,
      illegal: false,
      malicious: false,
      privateInformation: false,
      somethingChanged: true,
      violence: false,
    };
    for (let index in stateObj) {
      stateObj2[index] = stateObj[index];
    }
    setAbuse(stateObj2.abuse);
    setIllegal(stateObj2.illegal);
    setMalicious(stateObj2.malicious);
    setOption(stateObj2.option);
    setPrivateInformation(stateObj2.privateInformation);
    setViolence(stateObj2.violence);
    setSomethingChanged(stateObj2.somethingChanged);
  };

  return (
    <Container className="modal-container full-center" style={{ zIndex: 10 }}>
      <Container className="modal container medium column ov-auto bg-white br4">
        <Container className="x-fill justify-center bg-grey-10 py16">
          <h4 className="grey-11 tac">Report</h4>
        </Container>
        <Container className="column x-fill pa16">
          <h6 className="blue bold mb16">Reasons for the report</h6>
          <Container
            className="clickable align-center mb16"
            onClick={() =>
              handleChange({
                option: 1,
                violence: !violence,
              })
            }
          >
            <input
              className="mr8"
              checked={violence}
              style={{ minWidth: "13px" }}
              type="checkbox"
            />
            <p>Threatening or explicit violence</p>
          </Container>
          <Container
            className="clickable align-center mb16"
            onClick={() =>
              handleChange({
                abuse: !abuse,
                option: 2,
              })
            }
          >
            <input
              className="mr8"
              checked={abuse}
              style={{ minWidth: "13px" }}
              type="checkbox"
            />
            <p>Commits abuse or is harmful</p>
          </Container>
          <Container
            className="clickable align-center mb16"
            onClick={() =>
              handleChange({
                option: 3,
                privateInformation: !privateInformation,
              })
            }
          >
            <input
              className="mr8"
              checked={privateInformation}
              style={{ minWidth: "13px" }}
              type="checkbox"
            />
            <p>Private and personal information</p>
          </Container>
          <Container
            className="clickable align-center mb16"
            onClick={() =>
              handleChange({
                illegal: !illegal,
                option: 4,
              })
            }
          >
            <input
              className="mr8"
              checked={illegal}
              style={{ minWidth: "13px" }}
              type="checkbox"
            />
            <p>Illegal activities</p>
          </Container>
          <Container
            className="clickable align-center mb16"
            onClick={() =>
              handleChange({
                malicious: !malicious,
                option: 5,
              })
            }
          >
            <input
              className="mr8"
              checked={malicious}
              style={{ minWidth: "13px" }}
              type="checkbox"
            />
            <p>Malicious (Phishing, Scam, Spam)</p>
          </Container>
        </Container>
        {somethingChanged && (
          <Container className="full-center border-top pa16">
            <button
              className="button-2 py8 px32 mx4 br4"
              onClick={() => {
                submit(option);
                close();
              }}
            >
              Submit
            </button>
          </Container>
        )}
      </Container>
      <Container className="modal-background" onClick={close} />
    </Container>
  );
};

export default ReportModal;
