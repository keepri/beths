import { ERROR_CODE } from "./constants";
import {
    CustomError,
    type CustomErrorConfig,
    type CustomErrorMetadata,
} from "./custom-error";

const NAME: CustomErrorConfig["name"] = "NotFoundError";
const MESSAGE: CustomErrorConfig["message"] = "Not Found";
const CAUSE: CustomErrorConfig["cause"] =
    "The requested resource was not found.";
const STATUS_CODE: CustomErrorConfig["statusCode"] = 404;

export class NotFoundError extends CustomError {
    constructor(
        metadata?: CustomErrorMetadata,
        config?: Partial<CustomErrorConfig>,
    ) {
        super(metadata, {
            name: config?.name ?? NAME,
            message: config?.message ?? MESSAGE,
            cause: config?.cause ?? CAUSE,
            statusCode: config?.statusCode ?? STATUS_CODE,
            errorCode: config?.errorCode ?? ERROR_CODE.NOT_FOUND,
        });
    }
}
