export const USERS_INIT = 'users/init';
export const USER_PATCH = 'user/patch';
export const USER_REMOVE = 'user/remove';
export const USER_ADD = 'user/add';

export type UsersState = {
  users: UserInfo[];
};

export type UserInfo = {
  id?: number;
  firstName: string;
  middleName: string;
  lastName: string;
  birthDay: string;
  gender: 'female' | 'male';
  pastJobs: PastJobInfo[];
};

export type PastJobInfo = {
  id?: number;
  startDateWork: string;
  endDateWork: string;
  organizationName: string;
};

export type UsersAction = {
  type: typeof USERS_INIT | typeof USER_PATCH | typeof USER_REMOVE | typeof USER_ADD;
  payload: UsersState | UserPatchPayload | UserRemovePayload | UserAddPayload;
};

export type UserAddPayload = {
  user: UserInfo;
};

export type UserRemovePayload = {
  id: number;
};

export type UserPatchPayload = {
  user: UserInfo;
};
