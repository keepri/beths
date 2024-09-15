import { type Elysia, t } from "elysia";

import { GithubController } from "@/controllers/github/controller";

const NAME = "GitHub";
const PREFIX = "/github";

export function githubRoutes(app: Elysia) {
    return app.group(PREFIX, function handleRoutes(group) {
        group.config.name = NAME;

        group
            .get("/", GithubController.login)
            .get("/callback", GithubController.callback, {
                query: t.Object({
                    state: t.String(),
                    code: t.String(),
                }),
                cookie: t.Cookie({
                    github_oauth_state: t.String(),
                }),
            });

        return group;
    });
}
