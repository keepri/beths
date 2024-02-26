import { Elysia } from "elysia";

import { githubRoute } from "./github";

export const loginRoute = new Elysia({ name: "Login", prefix: "/login" }).use(
    githubRoute,
);
