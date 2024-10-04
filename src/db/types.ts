import { type InferInsertModel, type InferSelectModel } from "drizzle-orm";

import { type sessionsTable } from "./schema/session";
import { type usersTable } from "./schema/user";

export type DbSession = InferSelectModel<typeof sessionsTable>;
export type DbUser = InferSelectModel<typeof usersTable>;
export type DbInsertUser = InferInsertModel<typeof usersTable>;
