import { Elysia } from "elysia";

import { v1Route } from "./v1";

export const apiRoute = new Elysia({ name: "API", prefix: "/api" }).use(
    v1Route,
);
