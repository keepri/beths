import { type Elysia } from "elysia";

import { apiErrorHandler } from "@/errors/lib/api-handler";
import { NotFoundError } from "@/errors/not-found";

import { API_PREFIX } from "../lib/constants";
import { v1Routes } from "./v1";

const NAME = "API";
const PREFIX = "/" + API_PREFIX;

export function apiRoutes(app: Elysia) {
    return app.group(PREFIX, function handleRoutes(group) {
        group.config.name = NAME;

        group.use(apiErrorHandler).use(v1Routes).all("*", handleNotFound);

        return group;
    });
}

function handleNotFound() {
    throw new NotFoundError();
}
