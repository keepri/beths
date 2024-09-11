import { type Elysia } from "elysia";

import { NotFoundError } from "@/errors/not-found";
import { apiRoutes } from "@/routes/api";
import { pagesRoutes } from "@/routes/pages";

export function routes(app: Elysia) {
    return app.use(apiRoutes).use(pagesRoutes).all("*", handleNotFound);
}

function handleNotFound() {
    throw new NotFoundError();
}
