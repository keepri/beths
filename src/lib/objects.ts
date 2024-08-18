export function isObject(obj: unknown): boolean {
    const isObjectType = typeof obj === "object";
    const isNotNull = obj !== null;

    return isObjectType && isNotNull;
}
