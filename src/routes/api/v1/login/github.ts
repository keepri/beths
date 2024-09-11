import { type Elysia, t } from "elysia";

import { handleCallback } from "@/handlers/github/callback";
import { handleLogin } from "@/handlers/github/login";

const NAME = "GitHub";
const PREFIX = "/github";

export function githubRoutes(app: Elysia) {
    return app.group(PREFIX, function handleRoutes(group) {
        group.config.name = NAME;

        group.get("/", handleLogin).get("/callback", handleCallback, {
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
