import { type Elysia } from "elysia";

import { HealthController } from "@/controllers/health/controller";
import { V1_PREFIX } from "@/routes/lib/constants";

import { loginRoutes } from "./login";

const PREFIX = "/" + V1_PREFIX;
const NAME = "API v1";

export function v1Routes(app: Elysia) {
    return app.group(PREFIX, function handleRoutes(group) {
        group.config.name = NAME;

        group.use(loginRoutes).get("/healthz", HealthController.health);

        return group;
    });
}
