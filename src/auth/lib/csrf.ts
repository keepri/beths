import { verifyRequestOrigin } from "lucia";

export function isCSRF(headers: Request["headers"]) {
    const originHeader = headers.get("Origin");
    let hostHeader = headers.get("Host");

    if (!hostHeader) {
        hostHeader = headers.get("X-Forwarded-Host");
    }

    if (!originHeader || !hostHeader) {
        return true;
    }

    return !verifyRequestOrigin(originHeader, [hostHeader]);
}
