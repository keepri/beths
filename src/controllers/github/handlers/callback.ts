import { eq } from "drizzle-orm";
import { type InferContext } from "elysia";
import { generateId } from "lucia";

import { SESSION_LENGTH, github, lucia } from "@/auth";
import { db } from "@/db";
import { usersTable } from "@/db/schema/user";
import { BadRequestError } from "@/errors/bad-request";
import { type App } from "@/index";

const GITHUB_USER_API_URL = "https://api.github.com/user";

type GitHubUser = {
    id: number;
    login: string;
};

export async function handleCallback(ctx: InferContext<App>) {
    const stateCookie = ctx.cookie["github_oauth_state"].value,
        state = ctx.query.state,
        code = ctx.query.code,
        expiresAt = Date.now() + SESSION_LENGTH.milliseconds();
    let userId: string;

    if (stateCookie !== state || !code) {
        ctx.log.warn(
            { stateCookie, state, code },
            "Invalid state/stateCookie or code.",
        );
        throw new BadRequestError();
    }

    const githubUser = await fetchOAuthGithubUser(code);
    const user = await db.query.usersTable.findFirst({
        where: eq(usersTable.githubId, githubUser.id),
        columns: {
            id: true,
        },
    });

    if (!user) {
        userId = generateId(36);
        await db
            .insert(usersTable)
            .values({
                id: userId,
                githubId: githubUser.id,
                username: githubUser.login,
            })
            .execute();
        ctx.log.info({ id: userId }, `User ${githubUser.login} created.`);
    } else {
        userId = user.id;
    }

    const session = await lucia.createSession(userId, {
        // TODO Decide id column
        id: generateId(36),
        userId,
        expiresAt,
    });
    const sessionCookie = lucia.createSessionCookie(session.id);

    ctx.cookie[sessionCookie.name].set({
        ...sessionCookie.attributes,
        value: sessionCookie.value,
    });

    ctx.log.info({ id: userId }, `User ${githubUser.login} logged in.`);

    // TODO implement referrer
    return ctx.redirect("/", 302);
}

async function fetchOAuthGithubUser(code: string): Promise<GitHubUser> {
    const tokens = await github.validateAuthorizationCode(code);
    const userResponse = await fetch(GITHUB_USER_API_URL, {
        headers: {
            Authorization: `Bearer ${tokens.accessToken}`,
        },
    });
    const user = (await userResponse.json()) as GitHubUser;

    return user;
}
