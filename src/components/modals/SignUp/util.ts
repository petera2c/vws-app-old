import {
  createUserWithEmailAndPassword,
  getAuth,
  sendEmailVerification,
} from "@firebase/auth";
import { doc, setDoc } from "@firebase/firestore";
import { db } from "../../../config/db_init";
import dayjs from "dayjs";
import { message } from "antd";
import Cookies from "universal-cookie";

import { displayNameErrors } from "../../../util";

const cookies = new Cookies();

export const signUp = (
  { email, displayName, password, passwordConfirm }: any,
  navigate: any,
  setActiveModal: any,
  setUserBasicInfo: any
) => {
  if (displayNameErrors(displayName)) return;

  if (password !== passwordConfirm)
    return message.error("Passwords do not match.");

  const referral = cookies.get("referral");

  createUserWithEmailAndPassword(getAuth(), email.replace(/ /g, ""), password)
    .then(async (res) => {
      if (res.user) {
        await setDoc(doc(db, "users_display_name", res.user.uid), {
          server_timestamp: dayjs(res.user.metadata.creationTime).valueOf(),
          displayName,
        });

        if (referral)
          await setDoc(doc(db, "invited_users", res.user.uid), {
            referral_secondary_uid: referral,
          });

        await setDoc(doc(db, "users_settings", res.user.uid), {
          email_comment_like: true,
          email_comment_tagged: true,
          email_link_sign_up: true,
          email_promotions: true,
          email_quote_like: true,
          email_vent_commented: true,
          email_vent_like: true,
          email_vent_new: true,
          master_comment_like: true,
          master_comment_tagged: true,
          master_link_sign_up: true,
          master_quote_like: true,
          master_vent_commented: true,
          master_vent_like: true,
          master_vent_new: true,
          mobile_comment_like: true,
          mobile_comment_tagged: true,
          mobile_link_sign_up: true,
          mobile_quote_like: true,
          mobile_vent_commented: true,
          mobile_vent_like: true,
          mobile_vent_new: true,
          offensive_content: true,
        });

        sendEmailVerification(res.user);

        setUserBasicInfo({
          server_timestamp: dayjs(res.user.metadata.creationTime).valueOf(),
          displayName,
        });

        setActiveModal(false);
        navigate("/rules");
      }
    })
    .catch((e) => {
      alert(e);
    });
};
