export interface User {
  _id: string;
  email: string;
  name: string;
  supertokensId: string;
  createdAt: string;
  updatedAt: string;
  thirdParty?: ThirdPartyInfo;
}

export interface ThirdPartyInfo {
  id: string;
  userId: string;
}
