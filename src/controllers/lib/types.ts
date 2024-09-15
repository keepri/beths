import { type InferContext } from "elysia";

import { type App } from "@/index";

export type RequestHandler<T extends InferContext<App> = InferContext<App>> = (
    ctx: T,
) => unknown;
