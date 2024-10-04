import { Elysia } from "elysia";

import { GithubRoutes } from "./github";

const NAME = "Route.Login";
const PREFIX = "/login";

export const LoginRoutes = new Elysia({ name: NAME, prefix: PREFIX }).use(
    GithubRoutes,
);
