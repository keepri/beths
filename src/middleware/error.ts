import { Elysia } from "elysia";

import { context } from "@/context";
import { CUSTOM_ERROR_NAME, CustomError } from "@/errors";
import { InternalServerError } from "@/errors/internal";

const NAME = "Error handler";

export const errorHandler = new Elysia({ name: NAME })
    // TODO infer `context` types from App instead of using `context`
    .use(context)
    .error(CUSTOM_ERROR_NAME, CustomError)
    .error(CUSTOM_ERROR_NAME, InternalServerError)
    .onError(function onError(ctx) {
        // TODO improve error responses (problem details)
        // TODO add logging

        switch (ctx.code) {
            case "CUSTOM_ERROR": {
                ctx.set.status = ctx.error.statusCode;

                return ctx.error.message;
            }

            case "VALIDATION": {
                ctx.set.status = "Unprocessable Content";

                return "Unprocessable Content";
            }

            default: {
                ctx.set.status = "Internal Server Error";

                return "Something went wrong.";
            }
        }
    });
