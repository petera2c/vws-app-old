import { db } from "@/config/db_init";
import UserBasicInfo from "@/types/UserBasicInfo";
import { doc, updateDoc } from "@firebase/firestore";
import { message } from "antd";

export const getActiveSection = (activeSection: number) => {
  if (activeSection === 0) return "topType";
  else if (activeSection === 1) return "accessoriesType";
  else if (activeSection === 2) return "hairColor";
  else if (activeSection === 3) return "facialHairType";
  else if (activeSection === 4) return "clotheType";
  else if (activeSection === 5) return "eyeType";
  else if (activeSection === 6) return "eyebrowType";
  else if (activeSection === 7) return "mouthType";
  else if (activeSection === 8) return "skinColor";
  else return "";
};

export const saveAvatar = async (
  avatar: any,
  setUserBasicInfo: any,
  userID: string
) => {
  await updateDoc(doc(db, "users_display_name", userID), { avatar });

  setUserBasicInfo((oldInfo: UserBasicInfo) => {
    let temp = { ...oldInfo };
    temp.avatar = avatar;
    return temp;
  });

  message.success("Avatar saved!");
};

export const topArray = [
  { value: "NoHair", name: "No Hair" },
  { value: "Eyepatch", name: "Eyepatch" },
  { value: "Hat", name: "Hat" },
  { value: "Hijab", name: "Hijab" },
  { value: "Turban", name: "Turban" },
  { value: "WinterHat1", name: "Winter Hat" },
  { value: "WinterHat3", name: "Toque" },
  { value: "WinterHat4", name: "Kitty Toque" },
  { value: "LongHairBigHair", name: "Big Long Hair" },
  { value: "LongHairBob", name: "Long Hair Bob Cut" },
  { value: "LongHairBun", name: "Bun" },
  { value: "LongHairCurly", name: "Curly Long Hair" },
  { value: "LongHairCurvy", name: "Curvy Long Hair" },
  { value: "LongHairDreads", name: "Dreads" },
  { value: "LongHairFrida", name: "Flowers in Hair" },
  { value: "LongHairFro", name: "Afro" },
  { value: "LongHairFroBand", name: "Afro With a Head Band" },
  { value: "LongHairNotTooLong", name: "Medium Hair" },
  { value: "LongHairShavedSides", name: "Long Hair With Shaved Sides" },
  { value: "LongHairMiaWallace", name: "Medium Hair 2" },
  { value: "LongHairStraight", name: "Straight Long Hair 1" },
  { value: "LongHairStraight2", name: "Straight Long Hair 2" },
  { value: "LongHairStraightStrand", name: "Straight Long Hair 3" },
  { value: "ShortHairDreads01", name: "Short Spiky Hair" },
  { value: "ShortHairDreads02", name: "Round Spiky Hair" },
  { value: "ShortHairFrizzle", name: "Short Trendy Hair" },
  { value: "ShortHairShaggyMullet", name: "Shaggy Hair" },
  { value: "ShortHairShortCurly", name: "Short Hair 1" },
  { value: "ShortHairShortFlat", name: "Short Hair 2" },
  { value: "ShortHairShortRound", name: "Short Hair 3" },
  { value: "ShortHairShortWaved", name: "Short Hair 4" },
  { value: "ShortHairTheCaesar", name: "Short Hair 5" },
  { value: "ShortHairTheCaesarSidePart", name: "Short Hair 6" },
  { value: "ShortHairSides", name: "Bald with Hair on the Sides" },
];

export const accessoriesArray = [
  { value: "Blank", name: "None" },
  { value: "Kurt", name: "White Sunglasses" },
  { value: "Prescription01", name: "Prescription 1" },
  { value: "Prescription02", name: "Prescription 2" },
  { value: "Round", name: "Prescription 3" },
  { value: "Sunglasses", name: "Black Sunglasses 1" },
  { value: "Wayfarers", name: "Black Sunglasses 2" },
];
export const hairColorArray = [
  { value: "Auburn", name: "Auburn" },
  { value: "Black", name: "Black" },
  { value: "Blonde", name: "Blonde" },
  { value: "BlondeGolden", name: "Golden Blonde" },
  { value: "Brown", name: "Brown" },
  { value: "BrownDark", name: "Dark Brown" },
  { value: "PastelPink", name: "Pastel Pink" },
  { value: "Blue", name: "Blue" },
  { value: "Platinum", name: "Platinum" },
  { value: "Red", name: "Red" },
  { value: "SilverGray", name: "Silver/Gray" },
];
export const facialHairArray = [
  { value: "Blank", name: "None" },
  { value: "BeardMedium", name: "Medium Beard" },
  { value: "BeardLight", name: "Light Beard" },
  { value: "BeardMajestic", name: "Majestic Beard" },
  { value: "MoustacheFancy", name: "Fancy Moustache" },
  { value: "MoustacheMagnum", name: "Short Moustache" },
];
export const clothesArray = [
  { value: "BlazerShirt", name: "Blazer and Shirt" },
  { value: "BlazerSweater", name: "Blazer and Sweater" },
  { value: "CollarSweater", name: "White Collared Sweater" },
  { value: "GraphicShirt", name: "Graphic Tee Hoodie" },
  { value: "Hoodie", name: "Hoodie" },
  { value: "Overall", name: "Overalls" },
  { value: "ShirtCrewNeck", name: "Crew Neck Shirt" },
  { value: "ShirtScoopNeck", name: "Scoop Neck Shirt" },
  { value: "ShirtVNeck", name: "V Neck Shirt" },
];
export const eyesArray = [
  { value: "Close", name: "Closed" },
  { value: "Cry", name: "Crying" },
  { value: "Default", name: "Normal" },
  { value: "Dizzy", name: "Dizzy" },
  { value: "EyeRoll", name: "Eye Roll" },
  { value: "Happy", name: "Happy" },
  { value: "Hearts", name: "Hearts" },
  { value: "Side", name: "Side" },
  { value: "Squint", name: "Squint" },
  { value: "Surprised", name: "Surprised" },
  { value: "Wink", name: "Wink 1" },
  { value: "WinkWacky", name: "Wink 2" },
];
export const eyebrowArray = [
  { value: "Angry", name: " Angry 1" },
  { value: "AngryNatural", name: "Angry 2" },
  { value: "Default", name: "Normal 1" },
  { value: "DefaultNatural", name: "Normal 2" },
  { value: "FlatNatural", name: "Flat" },
  { value: "RaisedExcited", name: "Excited 1" },
  { value: "RaisedExcitedNatural", name: "Excited 2" },
  { value: "SadConcerned", name: "Sad 1" },
  { value: "SadConcernedNatural", name: "Sad 2" },
  { value: "UnibrowNatural", name: "Unibrow" },
  { value: "UpDown", name: "Up & Down 1" },
  { value: "UpDownNatural", name: "Up & Down 2" },
];
export const mouthArray = [
  { value: "Concerned", name: "Concerned" },
  { value: "Default", name: "Normal" },
  { value: "Disbelief", name: "Disbelief" },
  { value: "Eating", name: "Eating" },
  { value: "Grimace", name: "Grimace" },
  { value: "Sad", name: "Sad" },
  { value: "ScreamOpen", name: "Screaming" },
  { value: "Serious", name: "Serious" },
  { value: "Smile", name: "Smile" },
  { value: "Tongue", name: "Tongue Out" },
  { value: "Twinkle", name: "Twinkle" },
  { value: "Vomit", name: "Vomit" },
];
export const skinArray = [
  { value: "Tanned", name: "Tanned" },
  { value: "Yellow", name: "Yellow" },
  { value: "Pale", name: "Pale" },
  { value: "Light", name: "Light" },
  { value: "Brown", name: "Brown" },
  { value: "DarkBrown", name: "Dark Brown" },
  { value: "Black", name: "Black" },
];
