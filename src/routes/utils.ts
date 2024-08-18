import { isObject } from "@/lib/objects";

import { API_PREFIX, V1_PREFIX } from "./constants";
import { type APIVersion } from "./types";

type CreateAPIPathOptions = {
    version?: APIVersion;
    query?: Record<string, string>;
};

export function createAPIPath(path: string, options?: CreateAPIPathOptions) {
    const version = options?.version || V1_PREFIX;
    let apiPath = "/" + API_PREFIX + "/" + version + path;

    if (isObject(options?.query)) {
        const query = new URLSearchParams(options!.query).toString();
        if (query.length > 0) {
            apiPath += "?" + query.toString();
        }
    }

    return apiPath;
}
