import { type InferInsertModel, type InferSelectModel } from "drizzle-orm";
import { integer, sqliteTable, text } from "drizzle-orm/sqlite-core";

import { usersTable } from "./user";

export const sessionsTable = sqliteTable("sessions", {
    id: text("id").notNull().primaryKey(),
    userId: text("user_id")
        .notNull()
        .references(() => usersTable.id),
    expiresAt: integer("expires_at").notNull(),
});

export type DatabaseSession = InferSelectModel<typeof sessionsTable>;
export type Session = InferInsertModel<typeof sessionsTable>;
