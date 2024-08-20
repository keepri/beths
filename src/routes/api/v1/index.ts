import { Elysia } from "elysia";

import { V1_PREFIX } from "@/routes/constants";

import { loginRoute } from "./login";

const PREFIX = "/" + V1_PREFIX;
const NAME = "API v1";

export const v1Route = new Elysia({ name: NAME, prefix: PREFIX })
    .use(loginRoute)
    .get("/healthz", function handleHealthz() {
        return "Coolcoolcool!";
    });
