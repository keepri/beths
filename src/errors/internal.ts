import {
    CustomError,
    type CustomErrorConfig,
    type CustomErrorMetadata,
} from ".";

const MESSAGE = "Internal server error";
const STATUS_CODE = 500;
const ERROR_CODE = 5000;

export class InternalServerError extends CustomError {
    constructor(
        metadata?: CustomErrorMetadata,
        config?: Partial<CustomErrorConfig>,
    ) {
        super(metadata, {
            name: config?.name,
            message: config?.message ?? MESSAGE,
            statusCode: config?.statusCode ?? STATUS_CODE,
            errorCode: config?.errorCode ?? ERROR_CODE,
        });
    }
}
