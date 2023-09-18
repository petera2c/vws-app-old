import { Input, Modal } from "antd";
import React, { useState } from "react";

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
    <Modal onCancel={close}>
      <div className="modal container medium flex flex-col overflow-auto bg-white br4">
        <div className="w-full justify-center bg-grey-10 py-4">
          <h4 className="grey-11 text-center">Report</h4>
        </div>
        <div className="flex flex-col w-full p-4">
          <h6 className="blue bold mb-4">Reasons for the report</h6>
          <div
            className="cursor-pointer items-center mb-4"
            onClick={() =>
              handleChange({
                option: 1,
                violence: !violence,
              })
            }
          >
            <Input
              className="mr-2"
              checked={violence}
              style={{ minWidth: "13px" }}
              type="checkbox"
            />
            <p>Threatening or explicit violence</p>
          </div>
          <div
            className="cursor-pointer items-center mb-4"
            onClick={() =>
              handleChange({
                abuse: !abuse,
                option: 2,
              })
            }
          >
            <Input
              className="mr-2"
              checked={abuse}
              style={{ minWidth: "13px" }}
              type="checkbox"
            />
            <p>Commits abuse or is harmful</p>
          </div>
          <div
            className="cursor-pointer items-center mb-4"
            onClick={() =>
              handleChange({
                option: 3,
                privateInformation: !privateInformation,
              })
            }
          >
            <Input
              className="mr-2"
              checked={privateInformation}
              style={{ minWidth: "13px" }}
              type="checkbox"
            />
            <p>Private and personal information</p>
          </div>
          <div
            className="cursor-pointer items-center mb-4"
            onClick={() =>
              handleChange({
                illegal: !illegal,
                option: 4,
              })
            }
          >
            <Input
              className="mr-2"
              checked={illegal}
              style={{ minWidth: "13px" }}
              type="checkbox"
            />
            <p>Illegal activities</p>
          </div>
          <div
            className="cursor-pointer items-center mb-4"
            onClick={() =>
              handleChange({
                malicious: !malicious,
                option: 5,
              })
            }
          >
            <Input
              className="mr-2"
              checked={malicious}
              style={{ minWidth: "13px" }}
              type="checkbox"
            />
            <p>Malicious (Phishing, Scam, Spam)</p>
          </div>
        </div>
        {somethingChanged && (
          <div className="full-center border-top p-4">
            <button
              className="button-2 py-2 px-8 mx4 br4"
              onClick={() => {
                submit(option);
                close();
              }}
            >
              Submit
            </button>
          </div>
        )}
      </div>
    </Modal>
  );
};

export default ReportModal;
