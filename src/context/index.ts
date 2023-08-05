import UserBasicInfo from "@/types/UserBasicInfo";
import { User } from "@firebase/auth";
import { Dispatch, SetStateAction, createContext } from "react";

const OnlineUsersContext = createContext<{
  firstOnlineUsers: never[];
  setFirstOnlineUsers: Dispatch<SetStateAction<never[]>>;
  setTotalOnlineUsers: Dispatch<SetStateAction<number | undefined>>;
  totalOnlineUsers: number | undefined;
}>(null!);
const UserContext = createContext<{
  user: User | undefined;
  userBasicInfo: UserBasicInfo | undefined;
  setUserBasicInfo: Dispatch<SetStateAction<UserBasicInfo | undefined>>;
}>(null!);

export { OnlineUsersContext, UserContext };
