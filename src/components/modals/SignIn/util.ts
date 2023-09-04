import { getAuth, signInWithEmailAndPassword } from "@firebase/auth";

export const login = ({ email, password }: any, setActiveModal: any) => {
  signInWithEmailAndPassword(getAuth(), email.replace(/ /g, ""), password)
    .then(() => {
      setActiveModal();
    })
    .catch((error) => {
      alert(error);
    });
};
