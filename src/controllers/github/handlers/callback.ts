import { Elysia, t } from "elysia";

import { BadRequestError } from "@/errors/bad-request";
import { LoggerPlugin } from "@/plugins/logger";
import { AuthService } from "@/services/auth/service";
import { DbService } from "@/services/db/service";

const NAME = "Handler.GithubLoginCallback";
const PATH = "/callback";

export const LoginCallbackHandler = new Elysia({ name: NAME })
    .use(LoggerPlugin)
    .use(DbService)
    .use(AuthService)
    .guard({
        auth: false,
        query: t.Object({
            state: t.String(),
            code: t.String(),
        }),
        cookie: t.Cookie({
            github_oauth_state: t.String(),
        }),
    })
    .get(PATH, async function handleLoginCallback(ctx) {
        const stateCookie = ctx.cookie["github_oauth_state"].value,
            state = ctx.query.state,
            code = ctx.query.code;

        if (stateCookie !== state || !code) {
            ctx.log.warn(
                { stateCookie, state, code },
                "Invalid state/stateCookie or code.",
            );
            throw new BadRequestError();
        }

        const sessionCookie = await ctx.auth.github.createSessionCookie(code);

        ctx.cookie[sessionCookie.name].set({
            ...sessionCookie.attributes,
            value: sessionCookie.value,
        });

        // TODO implement referrer
        return ctx.redirect("/", 302);
    });
