import React, { useContext, useEffect, useState } from "react";
import TextArea from "react-textarea-autosize";
import { message, Space, Tooltip } from "antd";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

import HandleOutsideClick from "../containers/HandleOutsideClick/HandleOutsideClick";
import StarterModal from "../modals/Starter";

import { UserContext } from "../../context";

import {
  capitolizeFirstChar,
  countdown,
  getIsMobileOrTablet,
  isUserKarmaSufficient,
  viewTagFunction,
} from "../../util";
import {
  checkVentTitle,
  getQuote,
  getTags,
  getUserVentTimeOut,
  getVent,
  selectEncouragingMessage,
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

const TITLE_LENGTH_MINIMUM = 0;
const TITLE_LENGTH_MAXIMUM = 100;

function NewVentComponent({ isBirthdayPost, miniVersion, ventID }: any) {
  const { user, userBasicInfo } = useContext(UserContext);

  const [description, setDescription] = useState("");
  const [isMinified, setIsMinified] = useState(miniVersion);
  const [isMobileOrTablet, setIsMobileOrTablet] = useState(false);
  const [quote, setQuote] = useState<Quote>();
  const [saving, setSaving] = useState(false);
  const [starterModal, setStarterModal] = useState(false);
  const [tags, setTags] = useState([]);
  const [tagText, setTagText] = useState("");
  const [title, setTitle] = useState("");
  const [userVentTimeOut, setUserVentTimeOut] = useState<any>();
  const [userVentTimeOutFormatted, setUserVentTimeOutFormatted] = useState("");
  const [ventTags, setVentTags] = useState<{ id: string }[]>([]);
  const [searchedVentTags, setSearchedVentTags] = useState<any>([]);

  const [hasStartedToWriteVent, setHasStartedToWriteVent] = useState(false);
  const [placeholderText, setPlaceholderText] = useState("");
  const [postingDisableFunction, setPostingDisableFunction] = useState<any>();

  const router = useRouter();

  useEffect(() => {
    let interval: any;

    setPlaceholderText(selectEncouragingMessage());
    setIsMobileOrTablet(getIsMobileOrTablet());

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
        className={"flex flex-col br4 pa32 " + (isMinified ? "gap-2" : "gap-4")}
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
            className="w-full py8 px16 br4"
            onChange={(event) => {
              // if (postingDisableFunction) return postingDisableFunction();

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
            minRows={isMinified ? 1 : 3}
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
            <input
              className="w-full py8 px16 br4"
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
            <input
              className="w-full py8 px16 br4"
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
              <div className="flex-wrap gap-2">
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
            <div className="w-full flex-wrap gap-2">
              {tags.map((tag: Tag, index) => (
                <SelectedTag
                  postingDisableFunction={postingDisableFunction}
                  index={index}
                  key={tag.id}
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
              <button
                className="bg-blue white px64 py8 br4"
                onClick={() => {
                  if (postingDisableFunction) return postingDisableFunction();

                  if (!description) {
                    return message.info("You need to enter a description :)");
                  } else if (!checkVentTitle(title)) {
                    return;
                  } else {
                    setTagText("");
                    setSaving(true);

                    import("./util").then((functions) => {
                      functions.saveVent(
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
                    });
                  }
                }}
              >
                Submit
              </button>
            )}
          </div>
        )}
        {isMinified && quote && (
          <div className="grow full-center">
            <div className="flex flex-col grow items-center">
              <h1
                className={
                  "fs-18 no-bold grey-1 italic text-center " +
                  (getIsMobileOrTablet() ? "grow" : "container medium")
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
          className="flex flex-col pa32"
          style={{ borderTop: "2px solid var(--grey-color-2)" }}
        >
          <p>
            If you or someone you know is in danger, call your local emergency
            services or police.
          </p>
        </div>
      )}
      {starterModal && (
        <StarterModal
          activeModal={starterModal}
          setActiveModal={setStarterModal}
        />
      )}
    </HandleOutsideClick>
  );
}

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
      className="button-2 br4 gap-2 pa8"
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

function Tag({ postingDisableFunction, setTags, tagHit, tags }: any) {
  return (
    <button
      className="button-10 br4 px8 py4"
      onClick={() => {
        if (postingDisableFunction) return postingDisableFunction();

        if (tags && tags.length >= 3) {
          return message.info("You can not set more than 3 tags in a vent!");
        }
        import("./util").then((functions) => {
          functions.updateTags(setTags, tagHit);
        });
      }}
    >
      {viewTagFunction(tagHit.id)}
    </button>
  );
}

export default NewVentComponent;
