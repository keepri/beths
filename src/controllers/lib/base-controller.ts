import { withId } from "correlation-id";
import { type InferContext } from "elysia";

import { type App } from "@/index";

type RequestHandler = (ctx: InferContext<App>) => unknown;

export abstract class Controller {
    static handleRequest(handler: RequestHandler) {
        return function (ctx: InferContext<App>) {
            return withId(function () {
                return handler(ctx);
            });
        };
    }
}
