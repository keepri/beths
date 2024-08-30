import { type Elysia } from "elysia";

import { githubRoutes } from "./github";

const NAME = "Login";
const PREFIX = "/login";

export function loginRoutes(app: Elysia) {
    return app.group(PREFIX, function routes(group) {
        group.config.name = NAME;

        group.use(githubRoutes);

        return group;
    });
}
