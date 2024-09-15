import { generateState } from "arctic";
import { type InferContext } from "elysia";
import { TimeSpan } from "lucia";

import { github } from "@/auth";
import { IS_PRODUCTION } from "@/config/env";
import { type App } from "@/index";

export async function handleLogin(ctx: InferContext<App>) {
    const auth = await ctx.auth(ctx);

    if (auth.user) {
        ctx.log.debug(
            {
                userId: auth.user.id,
                sessionId: auth.session!.id,
            },
            "User already authenticated",
        );
        // TODO implement referrer
        return ctx.redirect("/", 302);
    }

    const state = generateState();
    const url = await github.createAuthorizationURL(state);

    ctx.cookie["github_oauth_state"].set({
        value: state,
        httpOnly: true,
        secure: IS_PRODUCTION,
        maxAge: new TimeSpan(1, "m").seconds(),
        domain: ctx.config.env.HOST,
        path: "/",
    });

    return ctx.redirect(url.toString(), 302);
}
