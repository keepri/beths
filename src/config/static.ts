import { staticPlugin } from "@elysiajs/static";
import { type Elysia } from "elysia";

import { staticDir } from "./lib";

const CONFIG: Parameters<typeof staticPlugin>[0] = {
    prefix: staticDir(),
    assets: staticDir(),
} as const;

// THIS HAS TO BE A FUNCTION...
export function StaticConfig(app: Elysia) {
    app.use(staticPlugin(CONFIG));

    return app;
}
