import { ERROR_CODE } from "./constants";
import {
    CustomError,
    type CustomErrorConfig,
    type CustomErrorMetadata,
} from "./custom-error";

const NAME: CustomErrorConfig["name"] = "UnauthorizedError";
const MESSAGE: CustomErrorConfig["message"] = "Unauthorized";
const CAUSE: CustomErrorConfig["cause"] =
    "The request requires user authentication.";
const STATUS_CODE: CustomErrorConfig["statusCode"] = 401;

export class UnauthorizedError extends CustomError {
    constructor(
        metadata?: CustomErrorMetadata,
        config?: Partial<CustomErrorConfig>,
    ) {
        super(metadata, {
            name: config?.name ?? NAME,
            message: config?.message ?? MESSAGE,
            cause: config?.cause ?? CAUSE,
            statusCode: config?.statusCode ?? STATUS_CODE,
            errorCode: config?.errorCode ?? ERROR_CODE.UNAUTHORIZED,
        });
    }
}
