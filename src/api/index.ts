import { Elysia } from "elysia";

import { v1 } from "./v1";

export const api = new Elysia({ name: "API", prefix: "/api" })
    .use(v1);
