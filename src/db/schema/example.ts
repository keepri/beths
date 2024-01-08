import { type InferSelectModel } from "drizzle-orm";
import { integer, sqliteTable } from "drizzle-orm/sqlite-core";

export const exampleTable = sqliteTable("myTable", {
    id: integer("id", { mode: "number" }).primaryKey({
        autoIncrement: true,
    }),
});

export type ExampleTable = InferSelectModel<typeof exampleTable>;
