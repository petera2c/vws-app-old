import { getAuth, signInWithEmailAndPassword } from "@firebase/auth";

export const login = ({ email, password }: any, setActiveModal: any) => {
  console.log(email);
  signInWithEmailAndPassword(getAuth(), email.replace(/ /g, ""), password)
    .then(() => {
      setActiveModal();
    })
    .catch((error) => {
      alert(error);
    });
};
