import { Elysia } from "elysia";

import { loginRoute } from "./login";

export const v1Route = new Elysia({ name: "API v1", prefix: "/v1" })
    .use(loginRoute)
    .get("/healthz", function handleHealthz() {
        return new Response("Coolcoolcool!");
    });
