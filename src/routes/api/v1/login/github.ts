import { generateState } from "arctic";
import { eq } from "drizzle-orm";
import { type Elysia, type InferContext, t } from "elysia";
import { TimeSpan, generateId } from "lucia";

import { SESSION_LENGTH, auth, github } from "@/auth";
import { IS_PRODUCTION, env } from "@/config/env";
import { db } from "@/db";
import { usersTable } from "@/db/schema";
import { type App } from "@/index";

type GitHubUserResult = {
    id: number;
    login: string;
};

const NAME = "GitHub";
const PREFIX = "/github";

export function githubRoutes(app: Elysia) {
    return app.group(PREFIX, function handleGithubRoutes(group) {
        group.config.name = NAME;

        group
            .get("/", async function handleGitHubOAuth(ctx: InferContext<App>) {
                const auth = await ctx.auth(ctx);

                if (auth.user) {
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
                    domain: env.HOST,
                    path: "/",
                });

                return ctx.redirect(url.toString(), 302);
            })
            .get(
                "/callback",
                async function handleGitHubOAuthCallback(
                    ctx: InferContext<App>,
                ) {
                    const stateCookie = ctx.cookie["github_oauth_state"].value;
                    const state = ctx.query.state;
                    const code = ctx.query.code;

                    // verify state
                    if (stateCookie !== state) {
                        ctx.log.warn(
                            { stateCookie, state },
                            "Invalid state/stateCookie.",
                        );

                        return ctx.error(400);
                    }

                    // TODO `code` is not possibly undefined because we are using the `query` type
                    const tokens = await github.validateAuthorizationCode(
                        code!,
                    );
                    const githubUserResponse = await fetch(
                        "https://api.github.com/user",
                        {
                            headers: {
                                Authorization: `Bearer ${tokens.accessToken}`,
                            },
                        },
                    );
                    const githubUserResult =
                        (await githubUserResponse.json()) as GitHubUserResult;

                    const existingUser = await db.query.usersTable.findFirst({
                        where: eq(usersTable.githubId, githubUserResult.id),
                    });

                    const expiresAt =
                        Date.now() + SESSION_LENGTH.milliseconds();

                    if (existingUser) {
                        // TODO FIXME we should check if the user already has a session
                        const session = await auth.createSession(
                            existingUser.id,
                            {
                                id: generateId(36),
                                userId: existingUser.id,
                                expiresAt,
                            },
                        );
                        const sessionCookie = auth.createSessionCookie(
                            session.id,
                        );

                        ctx.cookie[sessionCookie.name].set({
                            ...sessionCookie.attributes,
                            value: sessionCookie.value,
                        });

                        ctx.log.info(
                            { id: existingUser.id },
                            `User ${existingUser.username} logged in.`,
                        );

                        // TODO implement referrer
                        return ctx.redirect("/", 302);
                    }

                    // TODO Decide id column
                    const userId = generateId(36);
                    await db
                        .insert(usersTable)
                        .values({
                            id: userId,
                            githubId: githubUserResult.id,
                            username: githubUserResult.login,
                        })
                        .execute();

                    const session = await auth.createSession(userId, {
                        // TODO Decide id column
                        id: generateId(36),
                        userId,
                        expiresAt,
                    });
                    const sessionCookie = auth.createSessionCookie(session.id);

                    ctx.cookie[sessionCookie.name].set({
                        ...sessionCookie.attributes,
                        value: sessionCookie.value,
                    });

                    ctx.log.info(
                        { id: userId },
                        `User ${githubUserResult.login} created.`,
                    );

                    // TODO implement referrer
                    return ctx.redirect("/", 302);
                },
                {
                    query: t.Object({
                        state: t.String(),
                        code: t.String(),
                    }),
                    cookie: t.Cookie({
                        github_oauth_state: t.String(),
                    }),
                },
            );

        return group;
    });
}
