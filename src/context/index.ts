import { type Elysia } from "elysia";

import { env } from "@/config/env";
import { db } from "@/db";
import { withAuth } from "@/lib/auth";
import { withSSG } from "@/lib/ssg";

export function context(app: Elysia) {
    return app.decorate({
        db,
        auth: withAuth,
        ssg: withSSG,
        config: {
            env,
        },
    } as const);
}
