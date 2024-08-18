import { type InferSelectModel } from "drizzle-orm";
import { integer, sqliteTable, text } from "drizzle-orm/sqlite-core";

export const usersTable = sqliteTable("users", {
    id: text("id").notNull().primaryKey(),
    githubId: integer("github_id").unique(),
    username: text("username").notNull(),
});

export type DbUser = InferSelectModel<typeof usersTable>;
