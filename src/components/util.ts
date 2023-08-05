import { applyActionCode, getAuth } from "firebase/auth";

export const handleVerifyEmail = (
  navigate,
  oobCode,
  setErrorMessage,
  setVerifiedSuccess
) => {
  applyActionCode(getAuth(), oobCode)
    .then(() => {
      setVerifiedSuccess(true);
      setTimeout(() => {
        navigate("/");
      }, 2000);
    })
    .catch((error) => {
      console.log(error);
      setErrorMessage(error.message);
    });
};
