export const CUSTOM_ERROR_NAME = "CUSTOM_ERROR";

export type CustomErrorMetadata = Record<string, unknown>;
export type CustomErrorConfig = {
    name?: string;
    message: string;
    statusCode: number;
    errorCode: number;
};

export class CustomError extends Error {
    public statusCode: number;
    public errorCode: number;

    constructor(
        public metadata: CustomErrorMetadata = {},
        config: CustomErrorConfig,
    ) {
        super(config.message);
        this.name = config.name ?? CUSTOM_ERROR_NAME;
        this.errorCode = config.errorCode;
        this.statusCode = config.statusCode;
    }
}
