import React, { useContext, useEffect, useState } from "react";
import { Button, Input, message, Space, Tooltip } from "antd";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

import HandleOutsideClick from "../containers/HandleOutsideClick/HandleOutsideClick";

import { UserContext } from "../../context";

import {
  capitolizeFirstChar,
  countdown,
  isUserKarmaSufficient,
  useIsMobileOrTablet,
  viewTagFunction,
} from "../../util";
import {
  checkVentTitle,
  getQuote,
  getTags,
  getUserVentTimeOut,
  getVent,
  saveVent,
  selectEncouragingMessage,
  updateTags,
} from "./util";
import { checks } from "./util";
import Link from "next/link";
import MakeAvatar from "../views/MakeAvatar";
import Quote from "@/types/Quote";
import { faQuestionCircle, faTimes } from "@fortawesome/free-solid-svg-icons";
import Vent from "@/types/VentType";
import { useRouter } from "next/navigation";
import Tag from "@/types/Tag";
import Emoji from "../Emoji/Emoji";
import { useRecoilState } from "recoil";
import { starterModalAtom } from "@/atoms/ModalVisibility";
import TextArea from "antd/es/input/TextArea";

const TITLE_LENGTH_MINIMUM = 0;
const TITLE_LENGTH_MAXIMUM = 100;

const NewVentComponent = ({ isBirthdayPost, miniVersion, ventID }: any) => {
  const { user, userBasicInfo } = useContext(UserContext);
  const [, setStarterModal] = useRecoilState(starterModalAtom);

  const isMobileOrTablet = useIsMobileOrTablet();

  const [description, setDescription] = useState("");
  const [hasStartedToWriteVent, setHasStartedToWriteVent] = useState(false);
  const [isMinified, setIsMinified] = useState(miniVersion);
  const [placeholderText, setPlaceholderText] = useState("");
  const [postingDisableFunction, setPostingDisableFunction] = useState<any>();
  const [quote, setQuote] = useState<Quote>();
  const [saving, setSaving] = useState(false);
  const [searchedVentTags, setSearchedVentTags] = useState<any>([]);
  const [tagText, setTagText] = useState("");
  const [tags, setTags] = useState([]);
  const [title, setTitle] = useState("");
  const [userVentTimeOut, setUserVentTimeOut] = useState<any>();
  const [userVentTimeOutFormatted, setUserVentTimeOutFormatted] = useState("");
  const [ventTags, setVentTags] = useState<{ id: string }[]>([]);

  const router = useRouter();

  useEffect(() => {
    let interval: any;

    setPlaceholderText(selectEncouragingMessage());

    getTags(setSearchedVentTags, setVentTags);

    if (ventID) getVent(setDescription, setTags, setTitle, ventID);

    getQuote(setQuote);

    if (user) {
      getUserVentTimeOut((res: any) => {
        const temp = checks(
          isUserKarmaSufficient(userBasicInfo),
          setStarterModal,
          user,
          userBasicInfo,
          ventID,
          res
        );
        setPostingDisableFunction(temp);

        if (res) {
          interval = setInterval(
            () =>
              countdown(res, setUserVentTimeOut, setUserVentTimeOutFormatted),
            1000
          );
        }
      }, user.uid);
    } else {
      const temp = checks(
        true,
        setStarterModal,
        user,
        userBasicInfo,
        ventID,
        false
      );
      setPostingDisableFunction(temp);
    }
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [user, userBasicInfo, ventID]);

  return (
    <HandleOutsideClick
      className="w-full flex flex-col bg-white br8"
      close={() => {
        if (miniVersion) setIsMinified(true);
      }}
    >
      <div
        className={"flex flex-col br4 p-8 " + (isMinified ? "gap-2" : "gap-4")}
      >
        {!miniVersion && quote && (
          <div className="flex flex-col grow items-center">
            <h1 className="fs-22 italic text-center">"{quote.value}"</h1>
            <Link href={"/profile?" + quote.userID}>
              <p className="button-8 text-center lh-1">
                - {capitolizeFirstChar(quote.displayName)}
              </p>
            </Link>
          </div>
        )}
        {!miniVersion && userVentTimeOut > 0 && !ventID && (
          <Space direction="vertical">
            <p className="text-center">
              To avoid spam, people can only post once every few hours. With
              more Karma Points you can post more often. Please come back in
            </p>
            <h1 className="text-center">{userVentTimeOutFormatted}</h1>
          </Space>
        )}
        <div className="flex items-center gap-2">
          {(!isMobileOrTablet || (isMobileOrTablet && isMinified)) && (
            <Link href="/avatar">
              <MakeAvatar
                displayName={userBasicInfo?.displayName}
                userBasicInfo={userBasicInfo}
              />
            </Link>
          )}
          <TextArea
            className="w-full"
            onChange={(event) => {
              if (postingDisableFunction) return postingDisableFunction();

              setDescription(event.target.value);
            }}
            onClick={() => {
              setIsMinified(false);
              setHasStartedToWriteVent(true);
            }}
            placeholder={
              isBirthdayPost
                ? "Have the best birthday ever!"
                : userVentTimeOutFormatted
                ? "You can vent again in " + userVentTimeOutFormatted
                : placeholderText
            }
            value={description}
          />
          {!isMobileOrTablet && hasStartedToWriteVent && (
            <Emoji
              handleChange={(emoji) => {
                if (postingDisableFunction) return postingDisableFunction();

                setDescription(description + emoji);
              }}
            />
          )}
        </div>
        {!isMinified && (
          <Space className="w-full" direction="vertical">
            <h5 className="fw-400">Title</h5>
            <Input
              className="w-full"
              onChange={(e) => {
                if (postingDisableFunction) return postingDisableFunction();

                if (e.target.value.length > TITLE_LENGTH_MAXIMUM) {
                  return message.info(
                    "Vent titles can't have more than " +
                      TITLE_LENGTH_MAXIMUM +
                      " characters :("
                  );
                }

                setTitle(e.target.value);
                setSaving(false);
              }}
              placeholder="Our community is listening :)"
              type="text"
              value={title}
            />
            {title.length >= TITLE_LENGTH_MINIMUM && (
              <p className={title.length > TITLE_LENGTH_MAXIMUM ? "red" : ""}>
                {title.length}/{TITLE_LENGTH_MAXIMUM}
              </p>
            )}
          </Space>
        )}
        {!isMinified && (
          <Space className="w-full" direction="vertical">
            <h5 className="fw-400">Tag this vent</h5>
            <Input
              className="w-full"
              onChange={(e) => {
                if (postingDisableFunction) return postingDisableFunction();

                setSearchedVentTags(
                  searchStringInArray(e.target.value, ventTags)
                );

                setTagText(e.target.value);
              }}
              placeholder="Search tags"
              type="text"
              value={tagText}
            />
            {searchedVentTags && searchedVentTags.length > 0 && (
              <div className="flex flex-wrap gap-2">
                {searchedVentTags.map((tagHit: any) => (
                  <Tag
                    key={tagHit.id}
                    postingDisableFunction={postingDisableFunction}
                    setTags={setTags}
                    tagHit={tagHit}
                    tags={tags}
                  />
                ))}
              </div>
            )}
          </Space>
        )}
        {!isMinified && tags && tags.length > 0 && (
          <div className="flex flex-col gap-2">
            <h5>Selected Tags</h5>
            <div className="flex flex-wrap w-full gap-2">
              {tags.map((tag: Tag, index) => (
                <SelectedTag
                  index={index}
                  key={tag.id}
                  postingDisableFunction={postingDisableFunction}
                  setTags={setTags}
                  tag={tag}
                  tags={tags}
                />
              ))}
            </div>
          </div>
        )}

        {!isMinified && (
          <div className="justify-end">
            {!saving && (
              <Button
                className="bg-blue white px-16 py-2 br4"
                onClick={() => {
                  if (postingDisableFunction) return postingDisableFunction();

                  if (!description) {
                    return message.info("You need to enter a description :)");
                  } else if (!checkVentTitle(title)) {
                    return;
                  } else {
                    setTagText("");
                    setSaving(true);

                    saveVent(
                      (vent: Vent) => {
                        setSaving(false);
                        router.push(
                          "/vent/" +
                            vent.id +
                            "/" +
                            vent.title
                              .replace(/[^a-zA-Z ]/g, "")
                              .replace(/ /g, "-")
                              .toLowerCase()
                        );
                      },
                      isBirthdayPost,
                      tags,
                      {
                        description,
                        title,
                      },
                      ventID,
                      user
                    );
                  }
                }}
                type="primary"
              >
                Submit
              </Button>
            )}
          </div>
        )}
        {isMinified && quote && (
          <div className="grow full-center">
            <div className="flex flex-col grow items-center">
              <h1
                className={
                  "fs-18 no-bold grey-1 italic text-center " +
                  (isMobileOrTablet ? "grow" : "container medium")
                }
              >
                {quote.value}
              </h1>
              <Link href={"/profile?" + quote.userID}>
                <p className="blue text-center lh-1">
                  - {capitolizeFirstChar(quote.displayName)}
                </p>
              </Link>
            </div>
            <Tooltip
              placement="bottom"
              title="Win the Feel Good Quote Contest to have your quote featured here :)"
            >
              <Link href="/quote-contest">
                <FontAwesomeIcon icon={faQuestionCircle} />
              </Link>
            </Tooltip>
          </div>
        )}
      </div>
      {!miniVersion && (
        <div
          className="flex flex-col p-8"
          style={{ borderTop: "2px solid var(--grey-color-2)" }}
        >
          <p>
            If you or someone you know is in danger, call your local emergency
            services or police.
          </p>
        </div>
      )}
    </HandleOutsideClick>
  );
};

function searchStringInArray(str: string, strArray: { id: string }[]) {
  let temp = [];
  for (var j = 0; j < strArray.length; j++) {
    if (strArray[j].id.match(str)) temp.push(strArray[j]);
  }
  return temp;
}

function SelectedTag({
  index,
  postingDisableFunction,
  setTags,
  tag,
  tags,
}: {
  index: number;
  postingDisableFunction: any;
  setTags: any;
  tag: any;
  tags: any;
}) {
  return (
    <div
      className="button-2 br4 gap-2 p-2"
      onClick={() => {
        if (postingDisableFunction) return postingDisableFunction();

        let temp = [...tags];
        temp.splice(index, 1);
        setTags(temp);
      }}
    >
      <p className="ic grow">{viewTagFunction(tag.id)}</p>

      <FontAwesomeIcon icon={faTimes} />
    </div>
  );
}

const Tag = ({ postingDisableFunction, setTags, tagHit, tags }: any) => {
  return (
    <Button
      onClick={() => {
        if (postingDisableFunction) return postingDisableFunction();

        if (tags && tags.length >= 3) {
          return message.info("You can not set more than 3 tags in a vent!");
        }
        updateTags(setTags, tagHit);
      }}
    >
      {viewTagFunction(tagHit.id)}
    </Button>
  );
};

export default NewVentComponent;
