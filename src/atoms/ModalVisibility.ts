import { atom } from "recoil";

export const starterModalAtom = atom({
  key: "startedModalState",
  default: false as boolean | string,
});
