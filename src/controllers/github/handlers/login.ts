import { generateState } from "arctic";
import { Elysia } from "elysia";
import { TimeSpan } from "lucia";

import { IS_PRODUCTION, env } from "@/config/env";
import { LoggerPlugin } from "@/plugins/logger";
import { AuthService } from "@/services/auth/service";

const NAME = "Handler.GithubLogin";
const PATH = "/";

export const LoginHandler = new Elysia({ name: NAME })
    .use(AuthService)
    .guard({
        auth: false,
    })
    .use(LoggerPlugin)
    .get(PATH, async function handleLogin(ctx) {
        if (ctx.auth.user) {
            ctx.log.debug(
                {
                    userId: ctx.auth.user.id,
                    sessionId: ctx.auth.session!.id,
                },
                "User already authenticated",
            );
            // TODO implement referrer
            return ctx.redirect("/", 302);
        }

        const state = generateState();
        const url = await ctx.auth.github.createAuthorizationURL(state);

        ctx.cookie["github_oauth_state"].set({
            value: state,
            httpOnly: true,
            secure: IS_PRODUCTION,
            maxAge: new TimeSpan(1, "m").seconds(),
            domain: env.HOST,
            path: "/",
        });

        return ctx.redirect(url.toString(), 302);
    });
