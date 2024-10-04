import { Elysia } from "elysia";

import { RouteErrorHandler } from "@/errors/handlers/route";
import { NotFoundError } from "@/errors/not-found";
import { APIRoutes } from "@/routes/api/routes";
import { PagesRoutes } from "@/routes/pages/routes";

const NAME = "Route";

export const Routes = new Elysia({ name: NAME })
    .use(RouteErrorHandler)
    .use(APIRoutes)
    .use(PagesRoutes)
    .all("*", function handleNotFound() {
        throw new NotFoundError();
    });
