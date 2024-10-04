import { Elysia } from "elysia";

import { GithubController } from "@/controllers/github/controller";

const NAME = "Route.GitHub";
const PREFIX = "/github";

export const GithubRoutes = new Elysia({ name: NAME, prefix: PREFIX }).use(
    GithubController,
);
