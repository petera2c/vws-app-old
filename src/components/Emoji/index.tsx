import React, { useState } from "react";
import { Picker } from "emoji-mart";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

import HandleOutsideClick from "../containers/HandleOutsideClick";
import { faSmileBeam } from "@fortawesome/free-solid-svg-icons";

function Emoji({
  handleChange,
  top,
}: {
  handleChange: (emoji: string) => void;
  top?: boolean;
}) {
  const [displayEmojiDropdown, setDisplayEmojiDropdown] = useState(false);
  let style: any = {
    position: "absolute",
    top: "100%",
    right: 0,
    display: displayEmojiDropdown ? "" : "none",
    zIndex: 10,
  };

  if (top)
    style = {
      position: "absolute",
      bottom: "100%",
      right: 0,
      display: displayEmojiDropdown ? "" : "none",
      zIndex: 10,
    };

  return (
    <HandleOutsideClick
      className="column relative pa8 mx8"
      close={setDisplayEmojiDropdown}
    >
      <button onClick={() => setDisplayEmojiDropdown(!displayEmojiDropdown)}>
        <FontAwesomeIcon className="grey-5" icon={faSmileBeam} />
      </button>
      <div style={style}>
        {/* <Picker
          onSelect={(emojiObject) => {
            setDisplayEmojiDropdown(false);
            handleChange(emojiObject.native);
          }}
        /> */}
      </div>
    </HandleOutsideClick>
  );
}

export default Emoji;
