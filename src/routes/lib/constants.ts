import { TimeSpan } from "lucia";

export const API_PREFIX = "api";
export const API_VERSION_PREFIX = "v";

export const REVALIDATE_MS = new TimeSpan(7, "d").milliseconds();

export const MAX_BODY_SIZE_KB = 1024 * 1024 * 1; // 1mb
