import { Elysia } from "elysia";

import { env } from "@/config/env";
import { db } from "@/db";
import { withAuth } from "@/lib/auth";
import { withSSG } from "@/lib/ssg";

const NAME = "Context";

export const context = new Elysia({ name: NAME }).decorate({
    db,
    auth: withAuth,
    ssg: withSSG,
    config: {
        env,
    },
} as const);
