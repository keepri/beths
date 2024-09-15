import { withId } from "correlation-id";
import { type InferContext } from "elysia";

import { type App } from "@/index";

import { type RequestHandler } from "./types";

export function handleRequest<T extends InferContext<App>>(
    handler: RequestHandler<T>,
) {
    return function (ctx: T) {
        return withId(function () {
            return handler(ctx);
        });
    };
}
