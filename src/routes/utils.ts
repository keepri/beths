import { API_PREFIX, V1_PREFIX } from "./constants";

export type APIPrefix = "api";
export type APIVersion = "v1";

type CreateAPIPathOptions = {
    version?: APIVersion;
};

export function createAPIPath(path: string, options?: CreateAPIPathOptions) {
    const version = options?.version || V1_PREFIX;

    return "/" + API_PREFIX + "/" + version + path;
}
