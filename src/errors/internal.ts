import { ERROR_CODE } from "./constants";
import {
    CustomError,
    type CustomErrorConfig,
    type CustomErrorMetadata,
} from "./custom-error";

const NAME: CustomErrorConfig["name"] = "InternalServerError";
const MESSAGE: CustomErrorConfig["message"] = "Internal server error";
const CAUSE: CustomErrorConfig["cause"] = "An unexpected error occurred.";
const STATUS_CODE: CustomErrorConfig["statusCode"] = 500;

export class InternalServerError extends CustomError {
    constructor(
        metadata?: CustomErrorMetadata,
        config?: Partial<CustomErrorConfig>,
    ) {
        super(metadata, {
            name: config?.name ?? NAME,
            message: config?.message ?? MESSAGE,
            cause: config?.cause ?? CAUSE,
            statusCode: config?.statusCode ?? STATUS_CODE,
            errorCode: config?.errorCode ?? ERROR_CODE.INTERNAL,
        });
    }
}
