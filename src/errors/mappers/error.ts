import {
    InternalServerError,
    type InvertedStatusMap,
    NotFoundError,
    ParseError,
    ValidationError,
} from "elysia";

import { log } from "@/config/logger";

import { ERROR_CODE } from "../constants";
import { CustomError, type CustomErrorMetadata } from "../custom-error";
import { type StackTraceEntry, mapStackTrace } from "./stack-trace";

const CAUSE = "Unknown cause";

type MappedError = {
    name: string;
    message: string;
    cause: unknown;
    stack: Array<StackTraceEntry>;
    statusCode: keyof InvertedStatusMap;
    errorCode: ERROR_CODE;
    metadata: CustomErrorMetadata;
};

export function mapError<T extends Error>(error: T): MappedError {
    const stack = mapStackTrace(error);

    const mappedError: MappedError = {
        name: error.name,
        message: error.message,
        cause: error.cause ?? CAUSE,
        stack,
        statusCode: 500,
        errorCode: ERROR_CODE.INTERNAL,
        // TODO populate with necessary info like the authenticated user, etc.
        metadata: {},
    };

    if (error instanceof CustomError) {
        mappedError.statusCode = error.statusCode;
        mappedError.errorCode = error.errorCode;
        Object.assign(mappedError.metadata, error.metadata);
    }

    if (error instanceof ValidationError) {
        // TODO create mapper for validationError
        const validationError = JSON.parse(error.message);

        mappedError.message = validationError.summary;
        mappedError.cause = validationError.message;
        mappedError.statusCode = 422;
        mappedError.errorCode = ERROR_CODE.UNPROCESSABLE_CONTENT;
    }

    if (error instanceof ParseError) {
        log.debug("TODO ParseError in mapError", error);
    }

    if (error instanceof NotFoundError) {
        log.debug("TODO NotFoundError in mapError", error);
    }

    if (error instanceof InternalServerError) {
        log.debug("TODO InternalServerError in mapError", error);
    }

    return mappedError;
}
