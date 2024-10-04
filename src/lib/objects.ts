export function isObject(obj: unknown): obj is object {
    const isObjectType = typeof obj === "object";
    const isNotNull = obj !== null;

    return isObjectType && isNotNull;
}
