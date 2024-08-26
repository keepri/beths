import { Elysia } from "elysia";

import { githubRoutes } from "./github";

const NAME = "Login";
const PREFIX = "/login";

export const loginRoutes = new Elysia({ name: NAME, prefix: PREFIX }).use(
    githubRoutes,
);
