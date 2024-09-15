import { type InvertedStatusMap, ValidationError } from "elysia";

import { CustomError, type CustomErrorMetadata } from "@/errors";

import { ERROR_CODE } from "../constants";
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

    // TODO extract additional information from the error
    if (error instanceof ValidationError) {
        mappedError.statusCode = 422;
        mappedError.errorCode = ERROR_CODE.UNPROCESSABLE_CONTENT;
    }

    return mappedError;
}
