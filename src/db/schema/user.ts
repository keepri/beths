import { type InferInsertModel, type InferSelectModel } from "drizzle-orm";
import { integer, sqliteTable, text } from "drizzle-orm/sqlite-core";

export const userTable = sqliteTable("user", {
    id: text("id").notNull().primaryKey(),
    githubId: integer("github_id").unique(),
    username: text("username").notNull(),
});

export type DatabaseUser = InferSelectModel<typeof userTable>;
export type User = InferInsertModel<typeof userTable>;
