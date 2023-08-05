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
import { calculateKarma, getIsMobileOrTablet, useIsMounted } from "../../util";
import { deleteAccountAndAllData, getUser, updateUser } from "./util";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Container from "@/components/containers/Container/Container";
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
  const isMounted = useIsMounted();
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
      if (isMounted()) setAccountInfo(userInfo);
      if (userInfo && isMounted()) setUserInfo(userInfo);
    }, user?.uid);
  }, [isMounted, user]);

  return (
    <Page className="pa16">
      <Container>
        <Container className="flex-fill column">
          <form className="flex-fill column bg-white pa16 mb2 br8">
            <h6 className="blue bold mb16">Personal Information</h6>
            <Container className="wrap">
              <Container
                className={
                  "column pr8 mb16 " + (isMobileOrTablet ? "x-100" : "x-50")
                }
              >
                <p className="mb8">Display Name</p>
                <Container className="full-center bg-grey-4 py4 px8 br4">
                  <FontAwesomeIcon className="grey-5 mr8" icon={faMonument} />
                  <input
                    className="x-fill no-border bg-grey-4 br4"
                    onChange={(e) => setDisplayName(e.target.value)}
                    placeholder="Art Vandalay"
                    type="text"
                    value={displayName}
                  />
                </Container>
              </Container>
              <Container
                className={
                  "column pr8 mb16 " + (isMobileOrTablet ? "x-100" : "x-50")
                }
              >
                <p className="mb8">Email</p>
                <Container className="full-center bg-grey-4 py4 px8 br4">
                  <FontAwesomeIcon className="grey-5 mr8" icon={faPaperPlane} />
                  <Input
                    className="x-fill no-border bg-grey-4 br4"
                    onChange={(e) => setEmail(e.target.value)}
                    name="email"
                    placeholder="artvandalay@gmail.com"
                    type="text"
                    value={email || ""}
                  />
                </Container>
              </Container>
            </Container>

            <Container className="wrap">
              <Container
                className={
                  "column pr8 mb16 " + (isMobileOrTablet ? "x-100" : "x-50")
                }
              >
                <p className="mb8">Gender</p>
                <Container className="full-center bg-grey-4 py4 px8 br4">
                  <FontAwesomeIcon className="grey-5 mr8" icon={faVenusMars} />
                  <FontAwesomeIcon
                    className="grey-5 mr8"
                    icon={faTransgenderAlt}
                  />
                  <input
                    className="x-fill no-border bg-grey-4 br4"
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
                </Container>
              </Container>
              <Container
                className={
                  "column pr8 mb16 " + (isMobileOrTablet ? "x-100" : "x-50")
                }
              >
                <p className="mb8">Pronouns</p>
                <Container className="full-center bg-grey-4 py4 px8 br4">
                  <FontAwesomeIcon className="grey-5 mr8" icon={faVenusMars} />
                  <FontAwesomeIcon
                    className="grey-5 mr8"
                    icon={faTransgenderAlt}
                  />
                  <input
                    autoComplete="off"
                    className="x-fill no-border bg-grey-4 br4"
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
                </Container>
              </Container>
            </Container>

            <p className="mb8">Bio</p>
            <TextArea
              className="x-fill py8 px16 br4"
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

            <Container className="x-fill wrap">
              <Container className="column pr8 mb16">
                <Container className="align-center justify-start py8">
                  <p className="mr8 mb8">Birthday</p>
                  <FontAwesomeIcon className="grey-5" icon={faBirthdayCake} />
                </Container>

                <Container className="align-center">
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
                </Container>

                <p className="mt32">
                  This information will be used to connect you with other users
                  with common interests. This information will not be sold or
                  shared with any 3rd party.
                </p>
                <Container className="x-fill column align-start justify-center py8 mt16">
                  <p className="mr8 mb8">Partying</p>
                  <Container className="gap8 wrap">
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
                  </Container>
                </Container>

                <Container className="x-fill column align-start justify-center py8 mt16">
                  <p className="mr8 mb8">Political Beliefs</p>
                  <Container className="gap8 wrap">
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
                  </Container>
                </Container>
                <Container className="x-fill column align-start justify-center py8 mt16">
                  <p className="mr8 mb8">Religious Beliefs</p>
                  <Container className="gap8 wrap">
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
                  </Container>
                </Container>
                <Container className="x-fill column align-start justify-center py8 mt16">
                  <p className="mr8 mb8">Education</p>
                  <Container className="gap8 wrap">
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
                  </Container>
                </Container>
                <Container className="x-fill column align-start justify-center py8 mt16">
                  <p className="mb8 mr8">Do you have kids?</p>
                  <Container className="gap8 wrap">
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
                  </Container>
                </Container>
              </Container>
            </Container>

            <h6 className="blue bold mb16">Change your Password</h6>

            <Container className="wrap">
              <Container
                className={
                  "column pr8 mb16 " + (isMobileOrTablet ? "x-100" : "x-50")
                }
              >
                <p className="mb8">New Password</p>
                <Container className="full-center bg-grey-4 py4 px8 br4">
                  <FontAwesomeIcon className="grey-5 mr8" icon={faUnlockAlt} />

                  <input
                    autoComplete="off"
                    className="x-fill no-border bg-grey-4 br4"
                    name="password-change"
                    onChange={(e) => setNewPassword(e.target.value)}
                    placeholder="*******"
                    type={canSeePassword ? "" : "password"}
                    value={newPassword}
                  />
                </Container>
              </Container>
              <Container
                className={
                  "column mb16 " + (isMobileOrTablet ? "x-100" : "x-50")
                }
              >
                <p className="mb8">Confirm Password</p>
                <Container className="align-center">
                  <Container className="flex-fill full-center bg-grey-4 py4 px8 br4">
                    <FontAwesomeIcon
                      className="grey-5 mr8"
                      icon={faUnlockAlt}
                    />
                    <input
                      autoComplete="off"
                      className="x-fill no-border bg-grey-4 br4"
                      name="confirm-password-change"
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      placeholder="*******"
                      type={canSeePassword ? "" : "password"}
                      value={confirmPassword}
                    />
                  </Container>
                  <FontAwesomeIcon
                    className={
                      "clickable ml8 " + (canSeePassword ? "blue active" : "")
                    }
                    icon={faEye}
                    onClick={() => setCanSeePassword(!canSeePassword)}
                  />
                </Container>
              </Container>
            </Container>
          </form>
          <Container className="full-center bg-white pa16 br8">
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
          </Container>

          <Container className="mt16">
            <Button
              className="button-1 grey-1"
              onClick={() => setDeleteAccountModal(true)}
              size="large"
              type="text"
            >
              Delete Account and All Data
            </Button>
          </Container>
        </Container>
        <SubscribeColumn slot="1200594581" />
      </Container>
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
