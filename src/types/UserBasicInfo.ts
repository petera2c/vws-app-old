type UserBasicInfo = {
  avatar?: {
    topType?: string;
    accessoriesType?: string;
    hairColor?: string;
    facialHairType?: string;
    clotheType?: string;
    eyeType?: string;
    eyebrowType?: string;
    mouthType?: string;
    skinColor?: string;
  };
  displayName: string;
  id: string;
  is_admin?: boolean;
  karma?: number;
  server_timestamp: number;
  birth_date?: string;
  gender?: string;
  pronouns?: string;
  partying?: string;
  politicalBeliefs?: string;
  education?: string;
  kids?: string;
};

export default UserBasicInfo;
