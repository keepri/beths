import { type Elysia } from "elysia";

import { handleHealth } from "@/handlers/health";
import { V1_PREFIX } from "@/routes/constants";

import { loginRoutes } from "./login";

const PREFIX = "/" + V1_PREFIX;
const NAME = "API v1";

export function v1Routes(app: Elysia) {
    return app.group(PREFIX, function handleRoutes(group) {
        group.config.name = NAME;

        group.use(loginRoutes).get("/healthz", handleHealth);

        return group;
    });
}
