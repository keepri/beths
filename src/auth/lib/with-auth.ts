import { type InferContext } from "elysia";
import { type Session, type User } from "lucia";

import { auth } from "@/auth";
import { isCSRF } from "@/auth/lib/csrf";
import { type App } from "@/index";

export async function withAuth(
    ctx: InferContext<App>,
): Promise<{ user: User | null; session: Session | null }> {
    if (ctx.request.method !== "GET" && isCSRF(ctx.request.headers)) {
        ctx.log.warn(
            {
                headers: JSON.stringify(
                    Array.from(ctx.request.headers.entries()).reduce(
                        (acc, [key, value]) =>
                            Object.assign(acc, { [key]: value }),
                        {} as Record<string, string>,
                    ),
                ),
                body: JSON.stringify(ctx.body),
                cookies: JSON.stringify(ctx.request.headers.getSetCookie()),
                query: JSON.stringify(ctx.query),
            },
            "CSRF detected!",
        );

        return {
            user: null,
            session: null,
        };
    }

    const cookieHeader = ctx.request.headers.get("Cookie");
    const authorizationHeader = ctx.request.headers.get("Authorization");

    if (!cookieHeader && !authorizationHeader) {
        ctx.log.trace("No session cookie or bearer token found.");

        return {
            user: null,
            session: null,
        };
    }

    const sessionId = cookieHeader
        ? auth.readSessionCookie(cookieHeader)
        : auth.readBearerToken(authorizationHeader ?? "");

    if (!sessionId) {
        ctx.log.trace(
            { cookieHeader, authorizationHeader },
            "Could not read session id.",
        );

        return {
            user: null,
            session: null,
        };
    }

    const { user, session } = await auth.validateSession(sessionId);
    ctx.log.trace({ userId: user?.id, sessionId }, "Session found.");

    if (!cookieHeader) {
        return {
            user,
            session,
        };
    }

    if (!session) {
        ctx.log.trace({ sessionId }, "Session expired.");
        const cookie = auth.createBlankSessionCookie();
        ctx.cookie[cookie.name].set({
            ...cookie.attributes,
            value: cookie.value,
        });
    } else if (session.fresh) {
        ctx.log.trace({ sessionId }, "Session cookie refreshed.");
        const cookie = auth.createSessionCookie(session.id);
        ctx.cookie[cookie.name].set({
            ...cookie.attributes,
            value: cookie.value,
        });
    }

    return {
        user,
        session,
    };
}
