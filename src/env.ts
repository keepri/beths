import { createEnv } from "@t3-oss/env-core";
import { z } from "zod";

export const env = createEnv({
    isServer: true,
    runtimeEnv: Bun.env,
    emptyStringAsUndefined: true,
    server: {
        PORT: z.coerce.number().default(42069),
        HOSTNAME: z.string().default("127.0.0.1"),
    },
});
