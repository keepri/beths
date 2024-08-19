import { OAuth2RequestError, generateState } from "arctic";
import { eq } from "drizzle-orm";
import { Elysia } from "elysia";
import { TimeSpan, generateId } from "lucia";

import { SESSION_LENGTH, auth, github } from "@/auth";
import { IS_PRODUCTION, env } from "@/config";
import { context } from "@/context";
import { db } from "@/db";
import { usersTable } from "@/db/schema";

type GitHubUserResult = {
    id: number;
    login: string;
};

const NAME = "GitHub";
const PREFIX = "/github";

export const githubRoute = new Elysia({ name: NAME, prefix: PREFIX })
    .use(context)
    .get("/", async function handleGitHub(ctx): Promise<Response> {
        const auth = await ctx.auth(ctx);

        if (auth.user) {
            // TODO implement referrer
            return new Response(null, {
                status: 302,
                headers: { Location: "/" },
            });
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

        return new Response(null, {
            status: 302,
            headers: { Location: url.toString() },
        });
    })
    .get("/callback", async function handleGitHubOAuth(ctx) {
        const stateCookie = ctx.cookie["github_oauth_state"].value;
        const state = ctx.query.state;
        const code = ctx.query.code;

        // verify state
        if (!state || !stateCookie || !code || stateCookie !== state) {
            ctx.log.warn(
                { stateCookie, query: { state, code } },
                "Invalid state or code.",
            );

            return new Response(null, { status: 400 });
        }

        try {
            const tokens = await github.validateAuthorizationCode(code);
            const githubUserResponse = await fetch(
                "https://api.github.com/user",
                { headers: { Authorization: `Bearer ${tokens.accessToken}` } },
            );
            const githubUserResult =
                (await githubUserResponse.json()) as GitHubUserResult;

            const existingUser = await db.query.usersTable.findFirst({
                where: eq(usersTable.githubId, githubUserResult.id),
            });

            const expiresAt = Date.now() + SESSION_LENGTH.milliseconds();

            if (existingUser) {
                // TODO FIXME we should check if the user already has a session
                const session = await auth.createSession(existingUser.id, {
                    id: generateId(36),
                    userId: existingUser.id,
                    expiresAt,
                });
                const sessionCookie = auth.createSessionCookie(session.id);

                ctx.cookie[sessionCookie.name].set({
                    ...sessionCookie.attributes,
                    value: sessionCookie.value,
                });

                ctx.log.info(
                    { id: existingUser.id },
                    `User ${existingUser.username} logged in.`,
                );

                return new Response(null, {
                    status: 302,
                    // TODO implement referrer
                    headers: { Location: "/" },
                });
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

            return new Response(null, {
                status: 302,
                // TODO implement referrer
                headers: { Location: "/" },
            });
        } catch (error) {
            let status = 500;
            ctx.log.error(error, "OAuth2 request error occurred.");

            if (error instanceof OAuth2RequestError) {
                status = 400;
                // bad verification code, invalid credentials, etc
                return new Response(null, { status });
            }

            return new Response(null, { status });
        }
    });
