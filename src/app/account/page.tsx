"use client";
import React, { useContext, useEffect, useState } from "react";
import dayjs from "dayjs";
import TextArea from "react-textarea-autosize";
import { Button, Input, message } from "antd";
import DatePicker from "../../components/DatePicker";

import SubscribeColumn from "../../components/SubscribeColumn";

import { UserContext } from "../../context";

import {
  educationList,
  kidsList,
  partyingList,
  politicalBeliefsList,
  religiousBeliefsList,
} from "../../PersonalOptions";
import { calculateKarma, getIsMobileOrTablet } from "../../util";
import { deleteAccountAndAllData, getUser, updateUser } from "./util";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faBirthdayCake,
  faEye,
  faMonument,
  faPaperPlane,
  faTransgenderAlt,
  faUnlockAlt,
  faVenusMars,
} from "@fortawesome/free-solid-svg-icons";
import Page from "@/components/containers/Page/Page";
import DeleteAccountModal from "@/components/modals/DeleteAccount/DeleteAccount";

const AccountSection = () => {
  const { user, userBasicInfo, setUserBasicInfo } = useContext(UserContext);

  const [bio, setBio] = useState("");
  const [birthDate, setBirthDate] = useState<any>();
  const [canSeePassword, setCanSeePassword] = useState(false);
  const [confirmPassword, setConfirmPassword] = useState("");
  const [deleteAccountModal, setDeleteAccountModal] = useState(false);
  const [displayName, setDisplayName] = useState<any>(
    userBasicInfo?.displayName ? userBasicInfo.displayName : ""
  );
  const [email, setEmail] = useState(user?.email);
  const [gender, setGender] = useState("");
  const [isMobileOrTablet, setIsMobileOrTablet] = useState<any>();
  const [newPassword, setNewPassword] = useState("");
  const [pronouns, setPronouns] = useState("");
  const [userInfo, setUserInfo] = useState({});

  const [education, setEducation] = useState<any>();
  const [kids, setKids] = useState<any>();
  const [partying, setPartying] = useState<any>();
  const [politics, setPolitics] = useState<any>();
  const [religion, setReligion] = useState<any>();

  const setAccountInfo = (userInfo: any) => {
    if (userInfo.bio) setBio(userInfo.bio);
    if (userInfo.birth_date) setBirthDate(dayjs(userInfo.birth_date));
    if (userInfo.education !== undefined) setEducation(userInfo.education);
    if (userInfo.gender) setGender(userInfo.gender);
    if (userInfo.kids !== undefined) setKids(userInfo.kids);
    if (userInfo.partying !== undefined) setPartying(userInfo.partying);
    if (userInfo.politics !== undefined) setPolitics(userInfo.politics);
    if (userInfo.pronouns) setPronouns(userInfo.pronouns);
    if (userInfo.religion !== undefined) setReligion(userInfo.religion);
  };

  useEffect(() => {
    setIsMobileOrTablet(getIsMobileOrTablet());

    getUser((userInfo: any) => {
      setAccountInfo(userInfo);
      if (userInfo) setUserInfo(userInfo);
    }, user!.uid);
  }, [user]);

  return (
    <Page className="pa16">
      <div>
        <div className="grow flex flex-col">
          <form className="grow flex flex-col bg-white pa16 mb2 br8">
            <h6 className="blue bold mb16">Personal Information</h6>
            <div className="wrap">
              <div
                className={
                  "flex flex-col pr8 mb16 " +
                  (isMobileOrTablet ? "x-100" : "x-50")
                }
              >
                <p className="mb8">Display Name</p>
                <div className="full-center bg-grey-4 py4 px8 br4">
                  <FontAwesomeIcon className="grey-5 mr8" icon={faMonument} />
                  <input
                    className="w-full no-border bg-grey-4 br4"
                    onChange={(e) => setDisplayName(e.target.value)}
                    placeholder="Art Vandalay"
                    type="text"
                    value={displayName}
                  />
                </div>
              </div>
              <div
                className={
                  "flex flex-col pr8 mb16 " +
                  (isMobileOrTablet ? "x-100" : "x-50")
                }
              >
                <p className="mb8">Email</p>
                <div className="full-center bg-grey-4 py4 px8 br4">
                  <FontAwesomeIcon className="grey-5 mr8" icon={faPaperPlane} />
                  <Input
                    className="w-full no-border bg-grey-4 br4"
                    onChange={(e) => setEmail(e.target.value)}
                    name="email"
                    placeholder="artvandalay@gmail.com"
                    type="text"
                    value={email || ""}
                  />
                </div>
              </div>
            </div>

            <div className="wrap">
              <div
                className={
                  "flex flex-col pr8 mb16 " +
                  (isMobileOrTablet ? "x-100" : "x-50")
                }
              >
                <p className="mb8">Gender</p>
                <div className="full-center bg-grey-4 py4 px8 br4">
                  <FontAwesomeIcon className="grey-5 mr8" icon={faVenusMars} />
                  <FontAwesomeIcon
                    className="grey-5 mr8"
                    icon={faTransgenderAlt}
                  />
                  <input
                    className="w-full no-border bg-grey-4 br4"
                    onChange={(e) => {
                      if (e.target.value.length > 50)
                        return message.info(
                          "You can not write more than 50 characters for your gender"
                        );

                      setGender(e.target.value);
                    }}
                    placeholder="Any"
                    type="text"
                    value={gender}
                  />
                </div>
              </div>
              <div
                className={
                  "flex flex-col pr8 mb16 " +
                  (isMobileOrTablet ? "x-100" : "x-50")
                }
              >
                <p className="mb8">Pronouns</p>
                <div className="full-center bg-grey-4 py4 px8 br4">
                  <FontAwesomeIcon className="grey-5 mr8" icon={faVenusMars} />
                  <FontAwesomeIcon
                    className="grey-5 mr8"
                    icon={faTransgenderAlt}
                  />
                  <input
                    autoComplete="off"
                    className="w-full no-border bg-grey-4 br4"
                    onChange={(e) => {
                      if (e.target.value.length > 50)
                        return message.info(
                          "You can not write more than 50 characters for your pronoun"
                        );

                      setPronouns(e.target.value);
                    }}
                    name="pronouns"
                    placeholder="she/her he/him its/them"
                    type="text"
                    value={pronouns}
                  />
                </div>
              </div>
            </div>

            <p className="mb8">Bio</p>
            <TextArea
              className="w-full py8 px16 br4"
              onChange={(event) => {
                if (calculateKarma(userBasicInfo) < 20)
                  return message.info(
                    "You need 20 karma points to interact with this :)"
                  );

                setBio(event.target.value);
              }}
              placeholder="Let us know about you :)"
              minRows={3}
              value={bio}
            />

            <div className="w-full wrap">
              <div className="flex flex-col pr8 mb16">
                <div className="items-center justify-start py8">
                  <p className="mr8 mb8">Birthday</p>
                  <FontAwesomeIcon className="grey-5" icon={faBirthdayCake} />
                </div>

                <div className="items-center">
                  <DatePicker
                    value={
                      birthDate
                        ? dayjs(birthDate.format("YYYY/MM/DD"), "YYYY/MM/DD")
                        : null
                    }
                    format="YYYY/MM/DD"
                    onChange={(dateString) => {
                      if (!dateString) return setBirthDate(null);
                      const date = dayjs(dateString);

                      const diffInYears = dayjs().diff(date) / 31536000000;
                      if (diffInYears > 11) setBirthDate(date);
                      else
                        message.error(
                          "You are too young to use this application :'("
                        );
                    }}
                    size="large"
                  />
                </div>

                <p className="mt32">
                  This information will be used to connect you with other users
                  with common interests. This information will not be sold or
                  shared with any 3rd party.
                </p>
                <div className="w-full flex flex-col items-start justify-center py8 mt16">
                  <p className="mr8 mb8">Partying</p>
                  <div className="gap8 wrap">
                    {partyingList.map((str, index) => {
                      return (
                        <Button
                          className={
                            "grey-1 border-all px8 py4 br4 " +
                            (partying === index ? "blue active" : "")
                          }
                          key={index}
                          onClick={(e) => {
                            e.preventDefault();
                            if (partying !== index) setPartying(index);
                            else setPartying(undefined);
                          }}
                          size="large"
                        >
                          {str}
                        </Button>
                      );
                    })}
                  </div>
                </div>

                <div className="w-full flex flex-col items-start justify-center py8 mt16">
                  <p className="mr8 mb8">Political Beliefs</p>
                  <div className="gap8 wrap">
                    {politicalBeliefsList.map((str, index) => {
                      return (
                        <Button
                          className={
                            "grey-1 border-all px8 py4 br4 " +
                            (politics === index ? "blue active" : "")
                          }
                          key={index}
                          onClick={(e) => {
                            e.preventDefault();

                            if (politics !== index) setPolitics(index);
                            else setPolitics(undefined);
                          }}
                          size="large"
                        >
                          {str}
                        </Button>
                      );
                    })}
                  </div>
                </div>
                <div className="w-full flex flex-col items-start justify-center py8 mt16">
                  <p className="mr8 mb8">Religious Beliefs</p>
                  <div className="gap8 wrap">
                    {religiousBeliefsList.map((str, index) => {
                      return (
                        <Button
                          className={
                            "grey-1 border-all px8 py4 br4 " +
                            (religion === str ? "blue active" : "")
                          }
                          key={index}
                          onClick={(e) => {
                            e.preventDefault();

                            if (religion !== str) setReligion(str);
                            else setReligion(undefined);
                          }}
                          size="large"
                        >
                          {str}
                        </Button>
                      );
                    })}
                  </div>
                </div>
                <div className="w-full flex flex-col items-start justify-center py8 mt16">
                  <p className="mr8 mb8">Education</p>
                  <div className="gap8 wrap">
                    {educationList.map((str, index) => {
                      return (
                        <Button
                          className={
                            "grey-1 border-all px8 py4 br4 " +
                            (education === index ? "blue active" : "")
                          }
                          key={index}
                          onClick={(e) => {
                            e.preventDefault();

                            if (education !== index) setEducation(index);
                            else setEducation(undefined);
                          }}
                          size="large"
                        >
                          {str}
                        </Button>
                      );
                    })}
                  </div>
                </div>
                <div className="w-full flex flex-col items-start justify-center py8 mt16">
                  <p className="mb8 mr8">Do you have kids?</p>
                  <div className="gap8 wrap">
                    {kidsList.map((str, index) => {
                      return (
                        <Button
                          className={
                            "grey-1 border-all px8 py4 br4 " +
                            (kids === index ? "blue active" : "")
                          }
                          key={index}
                          onClick={(e) => {
                            e.preventDefault();

                            if (kids !== index) setKids(index);
                            else setKids(undefined);
                          }}
                          size="large"
                        >
                          {str}
                        </Button>
                      );
                    })}
                  </div>
                </div>
              </div>
            </div>

            <h6 className="blue bold mb16">Change your Password</h6>

            <div className="wrap">
              <div
                className={
                  "flex flex-col pr8 mb16 " +
                  (isMobileOrTablet ? "x-100" : "x-50")
                }
              >
                <p className="mb8">New Password</p>
                <div className="full-center bg-grey-4 py4 px8 br4">
                  <FontAwesomeIcon className="grey-5 mr8" icon={faUnlockAlt} />

                  <input
                    autoComplete="off"
                    className="w-full no-border bg-grey-4 br4"
                    name="password-change"
                    onChange={(e) => setNewPassword(e.target.value)}
                    placeholder="*******"
                    type={canSeePassword ? "" : "password"}
                    value={newPassword}
                  />
                </div>
              </div>
              <div
                className={
                  "flex flex-col mb16 " + (isMobileOrTablet ? "x-100" : "x-50")
                }
              >
                <p className="mb8">Confirm Password</p>
                <div className="items-center">
                  <div className="grow full-center bg-grey-4 py4 px8 br4">
                    <FontAwesomeIcon
                      className="grey-5 mr8"
                      icon={faUnlockAlt}
                    />
                    <input
                      autoComplete="off"
                      className="w-full no-border bg-grey-4 br4"
                      name="confirm-password-change"
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      placeholder="*******"
                      type={canSeePassword ? "" : "password"}
                      value={confirmPassword}
                    />
                  </div>
                  <FontAwesomeIcon
                    className={
                      "clickable ml8 " + (canSeePassword ? "blue active" : "")
                    }
                    icon={faEye}
                    onClick={() => setCanSeePassword(!canSeePassword)}
                  />
                </div>
              </div>
            </div>
          </form>
          <div className="full-center bg-white pa16 br8">
            <Button
              className="flex full-center cancel py8 px32 mx4 br4"
              onClick={() => {
                setDisplayName(user?.displayName);
                setEmail(user?.email);
                setNewPassword("");
                setConfirmPassword("");
                setAccountInfo(userInfo);
              }}
              size="large"
            >
              Cancel
            </Button>
            <Button
              className="button-2 py8 px32 mx4 br4"
              onClick={() =>
                updateUser(
                  bio,
                  birthDate,
                  confirmPassword,
                  displayName,
                  education,
                  email,
                  gender,
                  kids,
                  newPassword,
                  partying,
                  politics,
                  pronouns,
                  religion,
                  setUserBasicInfo,
                  user,
                  userInfo
                )
              }
              size="large"
            >
              Apply
            </Button>
          </div>

          <div className="mt16">
            <Button
              className="button-1 grey-1"
              onClick={() => setDeleteAccountModal(true)}
              size="large"
              type="text"
            >
              Delete Account and All Data
            </Button>
          </div>
        </div>
        <SubscribeColumn slot="1200594581" />
      </div>
      {deleteAccountModal && (
        <DeleteAccountModal
          close={() => setDeleteAccountModal(false)}
          submit={() => {
            deleteAccountAndAllData();
          }}
        />
      )}
    </Page>
  );
};

export default AccountSection;
