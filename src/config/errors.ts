import { Elysia } from "elysia";

import { BadRequestError } from "@/errors/bad-request";
import { CustomError } from "@/errors/custom-error";
import { InternalServerError } from "@/errors/internal";
import { NotFoundError } from "@/errors/not-found";
import { UnauthorizedError } from "@/errors/unauthorized";

const NAME = "Config.Errors";
const CODE = "CUSTOM_ERROR";

export const ErrorsConfig = new Elysia({ name: NAME })
    .error(CODE, CustomError)
    .error(CODE, BadRequestError)
    .error(CODE, UnauthorizedError)
    .error(CODE, NotFoundError)
    .error(CODE, InternalServerError);
