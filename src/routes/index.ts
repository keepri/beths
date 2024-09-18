import { type Elysia } from "elysia";

import { apiRoutes } from "@/routes/api";
import { pagesRoutes } from "@/routes/pages";

export function routes(app: Elysia) {
    return app.use(apiRoutes).use(pagesRoutes);
}
