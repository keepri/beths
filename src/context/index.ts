import { type Elysia } from "elysia";

import { withAuth } from "@/auth/lib/with-auth";
import { env } from "@/config/env";
import { db } from "@/db";
import { withSSG } from "@/routes/lib/with-ssg";

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
