import { GitHub } from "arctic/dist/providers/github";
import { Elysia } from "elysia";
import { generateId, verifyRequestOrigin } from "lucia";

import { SESSION_LENGTH } from "@/config/constants";
import { env } from "@/config/env";
import { createLuciaClient } from "@/config/lucia";
import { mapRequest } from "@/errors/mappers/request";
import { UnauthorizedError } from "@/errors/unauthorized";
import { LoggerPlugin } from "@/plugins/logger";

import { DbService } from "../db/service";

const NAME = "Service.Auth";
const GITHUB_USER_API_URL = "https://api.github.com/user";

export const AuthService = new Elysia({ name: NAME })
    .use(LoggerPlugin)
    .use(DbService)
    .decorate({
        isCSRF(headers: Request["headers"]) {
            const originHeader = headers.get("origin");
            let hostHeader = headers.get("host");

            if (!hostHeader) {
                hostHeader = headers.get("x-forwarded-host");
            }

            if (!originHeader || !hostHeader) {
                return true;
            }

            return !verifyRequestOrigin(originHeader, [hostHeader]);
        },
    })
    .derive(function handleDerive(ctx) {
        const lucia = createLuciaClient(ctx.db.client);

        const github = new GitHub(
            env.GITHUB_CLIENT_ID,
            env.GITHUB_CLIENT_SECRET,
        );

        return {
            lucia,
            github,
        };
    })
    .derive(async function handleDeriveAuthSession(ctx) {
        if (ctx.request.method !== "GET" && ctx.isCSRF(ctx.request.headers)) {
            const requestInfo = mapRequest(ctx);
            ctx.log.warn({ requestInfo }, "CSRF detected!");

            return {
                auth: {
                    user: null,
                    session: null,
                },
            };
        }

        const cookieHeader = ctx.request.headers.get("Cookie");
        const authorizationHeader = ctx.request.headers.get("Authorization");

        if (!cookieHeader && !authorizationHeader) {
            ctx.log.trace("No session cookie or bearer token found");

            return {
                auth: {
                    user: null,
                    session: null,
                },
            };
        }

        const sessionId = cookieHeader
            ? ctx.lucia.readSessionCookie(cookieHeader)
            : ctx.lucia.readBearerToken(authorizationHeader ?? "");

        if (!sessionId) {
            ctx.log.trace(
                { cookieHeader, authorizationHeader },
                "Could not read session id",
            );

            return {
                auth: {
                    user: null,
                    session: null,
                },
            };
        }

        const { user, session } = await ctx.lucia.validateSession(sessionId);

        if (!cookieHeader) {
            return {
                auth: {
                    user,
                    session,
                },
            };
        }

        if (!session) {
            ctx.log.trace({ sessionId }, "Session expired");
            const cookie = ctx.lucia.createBlankSessionCookie();
            ctx.cookie[cookie.name].set({
                ...cookie.attributes,
                value: cookie.value,
            });
        } else if (session.fresh) {
            ctx.log.trace({ sessionId }, "Session cookie refreshed");
            const cookie = ctx.lucia.createSessionCookie(session.id);
            ctx.cookie[cookie.name].set({
                ...cookie.attributes,
                value: cookie.value,
            });
        }

        return {
            auth: {
                user,
                session,
            },
        };
    })
    .derive(function handleDerive(ctx) {
        async function createSessionCookie(code: string) {
            const tokens = await ctx.github.validateAuthorizationCode(code);
            const githubUser = await fetchOAuthGithubUser(tokens.accessToken);
            let user = await ctx.db.getUserByGithubId(githubUser.id, {
                columns: {
                    id: true,
                },
            });

            if (!user) {
                user = await ctx.db.createUser({
                    githubId: githubUser.id,
                    username: githubUser.login,
                });
                ctx.log.info(
                    {
                        id: user.id,
                        login: user.username,
                    },
                    "Github user created",
                );
            }

            const session = await ctx.lucia.createSession(user.id, {
                // TODO Decide id column
                id: generateId(36),
                userId: user.id,
                expiresAt: Date.now() + SESSION_LENGTH.milliseconds(),
            });

            ctx.log.info(
                {
                    id: user.id,
                    login: githubUser.login,
                },
                "Created new Github session",
            );

            const sessionCookie = ctx.lucia.createSessionCookie(session.id);

            return sessionCookie;
        }

        return {
            auth: {
                ...ctx.auth,
                github: {
                    createAuthorizationURL: async (state: string) => {
                        const url =
                            await ctx.github.createAuthorizationURL(state);

                        return url;
                    },
                    createSessionCookie,
                },
            },
        };
    })
    .macro(function handleMacro(manager) {
        return {
            auth(requiredAuthState: boolean) {
                manager.onBeforeHandle(function handleBefore(ctx) {
                    const isAuthenticated = Boolean(
                        ctx.auth!.session || ctx.auth!.user,
                    );

                    if (isAuthenticated === !requiredAuthState) {
                        throw new UnauthorizedError();
                    }
                });
            },
        };
    })
    .as("plugin");

type GitHubUser = {
    id: number;
    login: string;
};

async function fetchOAuthGithubUser(accessToken: string): Promise<GitHubUser> {
    const userResponse = await fetch(GITHUB_USER_API_URL, {
        headers: {
            Authorization: `Bearer ${accessToken}`,
        },
    });
    const user = (await userResponse.json()) as GitHubUser;

    return user;
}
