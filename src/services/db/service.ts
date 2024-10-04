import { eq } from "drizzle-orm";
import { Elysia } from "elysia";
import { generateId } from "lucia";

import { createDrizzleClient } from "@/config/db";
import * as schema from "@/db/schema";
import { type DbInsertUser } from "@/db/types";
import { InternalServerError } from "@/errors/internal";
import { LoggerPlugin } from "@/plugins/logger";

const NAME = "Service.Database";

export const DbService = new Elysia({ name: NAME })
    .use(LoggerPlugin)
    .derive(function handleDeriveClientSchema(ctx) {
        const client = createDrizzleClient({
            logger: ctx.log.trace.bind(ctx.log),
        });

        return {
            db: {
                client,
                schema,
            },
        };
    })
    .derive(function handleDeriveMethods({
        db,
        db: {
            client,
            client: { query },
            schema: { usersTable },
        },
    }) {
        async function createUser(user: Omit<DbInsertUser, "id">) {
            // TODO Decide id column strategy
            const id = generateId(36);
            const newUser: DbInsertUser = {
                id,
                githubId: user.githubId,
                username: user.username,
            };

            // TODO we are using the db `client` as just playinly using `insert` fails
            // with "undefined this" issue.
            const result = await client
                .insert(usersTable)
                .values(newUser)
                .returning()
                .execute();

            if (result.length === 0) {
                throw new InternalServerError({
                    message: "Failed to insert new user row into db",
                    user: {
                        githubId: user.githubId,
                        username: user.username,
                    },
                });
            }

            return result[0];
        }

        type FindFirstUsersConfig = Parameters<
            typeof query.usersTable.findFirst
        >[0];

        function getUserByGithubId(id: number, config?: FindFirstUsersConfig) {
            return query.usersTable.findFirst({
                ...config,
                where: eq(usersTable.githubId, id),
            });
        }

        return {
            db: {
                ...db,
                createUser,
                getUserByGithubId,
            },
        };
    })
    .as("plugin");
