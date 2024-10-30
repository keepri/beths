export type AppLanguage = "en";
export type APIVersion = "1";

export type CreateDrizzleClientConfig = {
    logger(message?: unknown, ...optionalParams: Array<unknown>): void;
};
