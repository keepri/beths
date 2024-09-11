import {
    CustomError,
    type CustomErrorConfig,
    type CustomErrorMetadata,
} from ".";
import { ERROR_CODE } from "./constants";

export class BadRequestError extends CustomError {
    constructor(
        metadata?: CustomErrorMetadata,
        config?: Partial<CustomErrorConfig>,
    ) {
        super(metadata, {
            name: config?.name ?? "BadRequestError",
            message: config?.message ?? "Bad request",
            cause: config?.cause ?? "The request was malformed.",
            statusCode: config?.statusCode ?? 400,
            errorCode: config?.errorCode ?? ERROR_CODE.BAD_REQUEST,
        });
    }
}
