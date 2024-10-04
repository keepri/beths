import "@lucia-auth/adapter-drizzle";
import { DrizzleSQLiteAdapter } from "@lucia-auth/adapter-drizzle";
import { type BaseSQLiteDatabase } from "drizzle-orm/sqlite-core";
import { Lucia } from "lucia";

import { SESSION_LENGTH } from "@/config/constants";
import { IS_PRODUCTION, env } from "@/config/env";
import { sessionsTable } from "@/db/schema/session";
import { usersTable } from "@/db/schema/user";

import { DRIZZLE_CLIENT } from "./db";

/**
 * @description TODO This exists just so we can type `interface Register { Lucia }` in the "lucia" module.
 * It should not be used in the actual codebase.
 */
export const LUCIA = createLuciaClient(DRIZZLE_CLIENT);

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function createLuciaClient<T extends BaseSQLiteDatabase<any, any, any>>(
    db: T,
) {
    const adapter = new DrizzleSQLiteAdapter(db, sessionsTable, usersTable);
    const lucia = new Lucia(adapter, {
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

    return lucia;
}
