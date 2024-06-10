export enum StatusNames {
  DEFAULT = "DEFAULT",
  BANNED = "BANNED",
}

export enum ScopeNames {
  ONLY_READ = "ONLY_READ",
  ADMIN = "ADMIN",
}

export interface UserCredentials {
  internalScopes: string;
  internalStatus: string;
  userInfo: UserInfo;
}

export interface UserInfo {
  email: string;
  name: string;
  username: string;
  picture: string;
}

export interface ApiResponse<T> {
  code: number;
  message: string;
  data: Array<T>;
}
