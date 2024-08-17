import { logger as elysiaLogger } from "@bogeychan/elysia-logger";
import bearer from "@elysiajs/bearer";
import { Elysia } from "elysia";
import { type Cookie, type Session, type User } from "lucia";
import pretty from "pino-pretty";

import { auth, isCSRF } from "@/auth";
import { type Env, env } from "@/config";
import { db } from "@/db";

type DeriveSessionResult = {
    user: User | null;
    session: Session | null;
};

export const context = new Elysia({ name: "Context" })
    .decorate("db", db)
    .decorate("config", { env })
    .use(logger(env.LOG_LEVEL))
    .use(bearer())
    .derive(async function session(ctx): Promise<DeriveSessionResult> {
        let user = null;
        let session = null;

        if (ctx.request.method !== "GET" && isCSRF(ctx.request.headers)) {
            const headersEntries = ctx.request.headers.entries();
            const headers = Array.from(headersEntries).reduce(
                function createHeadersObj(acc, [key, value]) {
                    acc[key] = value;
                    return acc;
                },
                {} as Record<string, string>,
            );
            ctx.log.warn(
                {
                    headers: JSON.stringify(headers),
                    body: JSON.stringify(ctx.body),
                    cookies: JSON.stringify(ctx.request.headers.getSetCookie()),
                    query: JSON.stringify(ctx.query),
                },
                "CSRF detected!",
            );
            return { user, session };
        }

        const cookieHeader = ctx.request.headers.get("Cookie");
        const authorizationHeader = ctx.request.headers.get("Authorization");

        if (!cookieHeader && !authorizationHeader) {
            ctx.log.trace("No session cookie or bearer token found.");
            return { user, session };
        }

        const sessionId = cookieHeader
            ? auth.readSessionCookie(cookieHeader)
            : auth.readBearerToken(authorizationHeader ?? "");

        if (!sessionId) {
            ctx.log.trace(
                { cookieHeader, authorizationHeader },
                "Could not read session id.",
            );
            return { user, session };
        }

        ({ user, session } = await auth.validateSession(sessionId));
        ctx.log.trace({ userId: user?.id, sessionId }, "Session found.");

        if (!cookieHeader) {
            return { user, session };
        }

        let sessionCookie: Cookie;

        if (session && session.fresh) {
            ctx.log.trace({ sessionId }, "Session cookie refreshed.");
            sessionCookie = auth.createSessionCookie(session.id);
            ctx.cookie[sessionCookie.name].set({
                ...sessionCookie.attributes,
                value: sessionCookie.value,
            });
        }

        if (!session) {
            ctx.log.trace({ sessionId }, "Session expired.");
            sessionCookie = auth.createBlankSessionCookie();
            ctx.cookie[sessionCookie.name].set({
                ...sessionCookie.attributes,
                value: sessionCookie.value,
            });
        }

        return { user, session };
    });

export function logger(level: Env["LOG_LEVEL"]) {
    return elysiaLogger({
        level,
        stream: pretty({
            colorize: true,
            colorizeObjects: true,
            translateTime: "SYS:standard",
            levelFirst: true,
            singleLine: true,
        }),
    });
}
