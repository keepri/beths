import { TimeSpan } from "lucia";

import { type APIPrefix, type APIVersion } from "./types";

export const API_PREFIX: APIPrefix = "api";
export const V1_PREFIX: APIVersion = "v1";

export const REVALIDATE_MS = new TimeSpan(7, "d").milliseconds();

export enum PAGE_TAG {
    HOME = "home-page",
}
