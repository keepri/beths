import { type Elysia } from "elysia";

import { V1_PREFIX } from "@/routes/constants";

import { loginRoutes } from "./login";

const PREFIX = "/" + V1_PREFIX;
const NAME = "API v1";

export function v1Routes(app: Elysia) {
    return app.group(PREFIX, function handleV1Routes(group) {
        group.config.name = NAME;

        group.use(loginRoutes).get("/healthz", function handleHealthz() {
            return "Coolcoolcool!";
        });

        return group;
    });
}
