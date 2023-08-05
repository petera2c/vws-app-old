import { getAuth, sendPasswordResetEmail } from "@firebase/auth";

import { message } from "antd";

export const sendPasswordReset = ({ email }: { email: string }) => {
  sendPasswordResetEmail(getAuth(), email)
    .then(() => {
      // Email sent.
      message.success("Email password reset link sent!");
    })
    .catch((error) => {
      message.error(error);
    });
};
