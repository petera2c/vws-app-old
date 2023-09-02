"use client";
import React, { useContext, useEffect, useState } from "react";

import SubscribeColumn from "../../components/SubscribeColumn";

import { UserContext } from "../../context";

import { getUserBasicInfo } from "../../util";
import {
  accessoriesArray,
  clothesArray,
  eyebrowArray,
  eyesArray,
  facialHairArray,
  getActiveSection,
  hairColorArray,
  mouthArray,
  saveAvatar,
  skinArray,
  topArray,
} from "./util";
import Page from "@/components/containers/Page/Page";
import UserBasicInfo from "@/types/UserBasicInfo";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faCut,
  faEye,
  faGlasses,
  faHatWizard,
  faPalette,
  faPencil,
  faUserTie,
} from "@fortawesome/free-solid-svg-icons";
import { Avatar } from "antd";

const AvatarSection = () => {
  const { setUserBasicInfo, user } = useContext(UserContext);

  const [activeSection, setActiveSection] = useState(0);
  const [avatar, setAvatar] = useState<any>({});
  const sectionsArray = [
    topArray,
    accessoriesArray,
    hairColorArray,
    facialHairArray,
    clothesArray,
    eyesArray,
    eyebrowArray,
    mouthArray,
    skinArray,
  ];

  useEffect(() => {
    getUserBasicInfo((userInfo: UserBasicInfo) => {
      if (userInfo && userInfo.avatar) setAvatar(userInfo.avatar);
    }, user?.uid!);
  }, [setAvatar, user]);

  return (
    <Page className="pa16">
      <div className="w-full grow">
        <div className="flex flex-col grow">
          <div
            className="overflow-hidden gap16"
            style={{ maxHeight: "calc(70vh - 80px)" }}
          >
            <div className="flex flex-col bg-white overflow-auto pa16 br8">
              <button
                className={
                  "flex items-center grey-1 gap8 mb16 " +
                  (activeSection === 0 ? "blue" : "")
                }
                onClick={() => setActiveSection(0)}
              >
                <FontAwesomeIcon icon={faHatWizard} />
                Hair
              </button>
              <button
                className={
                  "flex items-center grey-1 gap8 mb16 " +
                  (activeSection === 1 ? "blue" : "")
                }
                onClick={() => setActiveSection(1)}
              >
                <FontAwesomeIcon icon={faGlasses} />
                Accessories
              </button>
              <button
                className={
                  "flex items-center grey-1 gap8 mb16 " +
                  (activeSection === 2 ? "blue" : "")
                }
                onClick={() => setActiveSection(2)}
              >
                <FontAwesomeIcon icon={faPalette} />
                Hair Color
              </button>
              <button
                className={
                  "flex items-center grey-1 gap8 mb16 " +
                  (activeSection === 3 ? "blue" : "")
                }
                onClick={() => setActiveSection(3)}
              >
                <FontAwesomeIcon icon={faCut} />
                Facial Hair
              </button>
              <button
                className={
                  "flex items-center grey-1 gap8 mb16 " +
                  (activeSection === 4 ? "blue" : "")
                }
                onClick={() => setActiveSection(4)}
              >
                <FontAwesomeIcon icon={faUserTie} />
                Clothes
              </button>
              <button
                className={
                  "flex items-center grey-1 gap8 mb16 " +
                  (activeSection === 5 ? "blue" : "")
                }
                onClick={() => setActiveSection(5)}
              >
                <FontAwesomeIcon icon={faEye} />
                Eyes
              </button>
              <button
                className={
                  "flex items-center grey-1 gap8 mb16 " +
                  (activeSection === 6 ? "blue" : "")
                }
                onClick={() => setActiveSection(6)}
              >
                <FontAwesomeIcon icon={faPencil} />
                Eyebrows
              </button>
              <button
                className={
                  "flex items-center grey-1 gap8 mb16 " +
                  (activeSection === 7 ? "blue" : "")
                }
                onClick={() => setActiveSection(7)}
              >
                Mouth
              </button>
              <button
                className={
                  "flex items-center grey-1 gap8 " +
                  (activeSection === 8 ? "blue" : "")
                }
                onClick={() => setActiveSection(8)}
              >
                <FontAwesomeIcon icon={faPalette} />
                Skin
              </button>
            </div>
            <div className="grow flex flex-col overflow-auto bg-white br8">
              {sectionsArray[activeSection].map((obj, index) => (
                <div key={index}>
                  <button
                    className={
                      "grow grey-1 py16 " +
                      (index !== sectionsArray[activeSection].length - 1
                        ? "border-bottom "
                        : " ") +
                      (obj.value === avatar[getActiveSection(activeSection)]
                        ? "blue"
                        : "")
                    }
                    onClick={() => {
                      avatar[getActiveSection(activeSection)] = obj.value;
                      setAvatar({ ...avatar });
                    }}
                  >
                    {obj.name}
                  </button>
                </div>
              ))}
            </div>
          </div>
          <div className="items-center justify-between mt16">
            <Avatar
              // @ts-ignore
              avatarStyle="Circle"
              topType={avatar.topType}
              accessoriesType={avatar.accessoriesType}
              hairColor={avatar.hairColor}
              facialHairType={avatar.facialHairType}
              clotheType={avatar.clotheType}
              eyeType={avatar.eyeType}
              eyebrowType={avatar.eyebrowType}
              mouthType={avatar.mouthType}
              skinColor={avatar.skinColor}
              style={{ width: "100px", height: "100px" }}
            />
            <button
              className="button-2 px16 py8 br4"
              onClick={() => saveAvatar(avatar, setUserBasicInfo, user!.uid)}
            >
              Save Avatar
            </button>
          </div>
        </div>
        <SubscribeColumn slot="9793400477" />
      </div>
    </Page>
  );
};

export default AvatarSection;
