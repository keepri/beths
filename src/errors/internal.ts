import {
    CustomError,
    type CustomErrorConfig,
    type CustomErrorMetadata,
} from ".";
import { ERROR_CODE } from "./lib/constants";

export class InternalServerError extends CustomError {
    constructor(
        metadata?: CustomErrorMetadata,
        config?: Partial<CustomErrorConfig>,
    ) {
        super(metadata, {
            name: config?.name ?? "InternalServerError",
            message: config?.message ?? "Internal server error",
            cause: config?.cause ?? "An unexpected error occurred.",
            statusCode: config?.statusCode ?? 500,
            errorCode: config?.errorCode ?? ERROR_CODE.INTERNAL,
        });
    }
}
