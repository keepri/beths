import Elysia from "elysia";

import { CUSTOM_ERROR_NAME, CustomError } from "@/errors";
import { InternalServerError } from "@/errors/internal";

const NAME = "Error handler";

export const errorHandler = new Elysia({ name: NAME })
    .error(CUSTOM_ERROR_NAME, CustomError)
    .error(CUSTOM_ERROR_NAME, InternalServerError)
    .onError(function onError(ctx) {
        // TODO improve error responses (problem details)
        // TODO add logging

        switch (ctx.code) {
            case "CUSTOM_ERROR": {
                return new Response(ctx.error.message, {
                    status: ctx.error.statusCode,
                });
            }

            default:
                return new Response("Something went wrong.", {
                    status: 500,
                });
        }
    });
