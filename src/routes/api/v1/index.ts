import { Elysia } from "elysia";

import { V1_PREFIX } from "@/routes/constants";

import { loginRoutes } from "./login";

const PREFIX = "/" + V1_PREFIX;
const NAME = "API v1";

export const v1Routes = new Elysia({ name: NAME, prefix: PREFIX })
    .use(loginRoutes)
    .get("/healthz", function handleHealthz() {
        return "Coolcoolcool!";
    });
