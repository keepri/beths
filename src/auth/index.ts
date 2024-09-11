import "@lucia-auth/adapter-drizzle";
import { DrizzleSQLiteAdapter } from "@lucia-auth/adapter-drizzle";
import { GitHub } from "arctic";
import { Lucia, TimeSpan } from "lucia";

import { IS_PRODUCTION, env } from "@/config/env";
import { db } from "@/db";
import { sessionsTable, usersTable } from "@/db/schema";

export const github = new GitHub(
    env.GITHUB_CLIENT_ID,
    env.GITHUB_CLIENT_SECRET,
);

export const SESSION_LENGTH: TimeSpan = new TimeSpan(1, "d");

const adapter = new DrizzleSQLiteAdapter(db, sessionsTable, usersTable);

export const lucia = new Lucia(adapter, {
    sessionExpiresIn: SESSION_LENGTH,
    sessionCookie: {
        expires: true,
        attributes: {
            secure: IS_PRODUCTION,
            sameSite: IS_PRODUCTION ? "strict" : "lax",
            domain: env.HOST,
            path: "/",
        },
    },
    getSessionAttributes(attributes) {
        return {
            id: attributes.id,
            userId: attributes.userId,
            expiresAt: attributes.expiresAt,
        };
    },
    getUserAttributes(attributes) {
        return {
            id: attributes.id,
            githubId: attributes.githubId,
            username: attributes.username,
        };
    },
});
