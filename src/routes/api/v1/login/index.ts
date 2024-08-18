import { Elysia } from "elysia";

import { githubRoute } from "./github";

const NAME = "Login";
const PREFIX = "/login";

export const loginRoute = new Elysia({ name: NAME, prefix: PREFIX }).use(
    githubRoute,
);
