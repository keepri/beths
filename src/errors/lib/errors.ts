import { type Elysia } from "elysia";

import { CustomError } from "..";
import { InternalServerError } from "../internal";
import { CODE } from "./constants";

export function errors(app: Elysia) {
    return app.error(CODE, CustomError).error(CODE, InternalServerError);
}
