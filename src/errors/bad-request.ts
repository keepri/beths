import { ERROR_CODE } from "./constants";
import {
    CustomError,
    type CustomErrorConfig,
    type CustomErrorMetadata,
} from "./custom-error";

const NAME: CustomErrorConfig["name"] = "BadRequestError";
const MESSAGE: CustomErrorConfig["message"] = "Bad request";
const CAUSE: CustomErrorConfig["cause"] = "The request was malformed.";
const STATUS_CODE: CustomErrorConfig["statusCode"] = 400;

export class BadRequestError extends CustomError {
    constructor(
        metadata?: CustomErrorMetadata,
        config?: Partial<CustomErrorConfig>,
    ) {
        super(metadata, {
            name: config?.name ?? NAME,
            message: config?.message ?? MESSAGE,
            cause: config?.cause ?? CAUSE,
            statusCode: config?.statusCode ?? STATUS_CODE,
            errorCode: config?.errorCode ?? ERROR_CODE.BAD_REQUEST,
        });
    }
}
