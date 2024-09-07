import {
    CustomError,
    type CustomErrorConfig,
    type CustomErrorMetadata,
} from ".";
import { ERROR_CODE } from "./constants";

export class NotFoundError extends CustomError {
    constructor(
        metadata?: CustomErrorMetadata,
        config?: Partial<CustomErrorConfig>,
    ) {
        super(metadata, {
            name: config?.name ?? "NotFoundError",
            message: config?.message ?? "Not Found",
            cause: config?.cause ?? "The requested resource was not found.",
            statusCode: config?.statusCode ?? 404,
            errorCode: config?.errorCode ?? ERROR_CODE.NOT_FOUND,
        });
    }
}
