import { type InvertedStatusMap } from "elysia";

import { type ERROR_CODE } from "./lib/constants";

export type CustomErrorMetadata = Record<string, unknown>;
export type CustomErrorConfig = {
    name: string;
    message: string;
    cause: unknown;
    statusCode: keyof InvertedStatusMap;
    errorCode: ERROR_CODE;
};

export class CustomError extends Error {
    public statusCode: CustomErrorConfig["statusCode"];
    public errorCode: CustomErrorConfig["errorCode"];

    constructor(
        public metadata: CustomErrorMetadata = {},
        config: CustomErrorConfig,
    ) {
        super(config.message);

        this.name = config.name;
        this.cause = config.cause;
        this.statusCode = config.statusCode;
        this.errorCode = config.errorCode;
    }
}
