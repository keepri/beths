import { env } from "@/config/env";
import { type APIVersion } from "@/config/types";
import { isObject } from "@/lib/objects";

import { API_PREFIX, API_VERSION_PREFIX } from "./constants";

type CreateAPIPathOptions = {
    version?: APIVersion;
    query?: Record<string, string>;
};

// eslint-disable-next-line jsdoc/require-param, jsdoc/require-returns
/**
 * @description TODO There seems no need to implement explicit `options.params`
 * as the API path params can be defined on the caller side.
 */
export function createAPIPath(path: string, options?: CreateAPIPathOptions) {
    const versionPath = createAPIVersionPath(options?.version);
    let apiPath = "/" + API_PREFIX + versionPath + path;

    if (isObject(options?.query)) {
        const query = new URLSearchParams(options.query).toString();
        if (query.length > 0) {
            apiPath += "?" + query;
        }
    }

    return apiPath;
}

export function createAPIVersionPath(
    version?: APIVersion,
): `/${typeof API_VERSION_PREFIX}${APIVersion}` {
    return `/${API_VERSION_PREFIX}${version ?? env.API_VERSION}`;
}
