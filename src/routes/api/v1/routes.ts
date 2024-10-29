import { Elysia } from "elysia";

import { HealthHandler } from "@/controllers/health/handlers/health";
import { createAPIVersionPath } from "@/routes/lib/api-path";

// import { LoginRoutes } from "./login/routes";

const NAME = "Route.V1";
const PREFIX = createAPIVersionPath("1");

export const V1Routes = new Elysia({ name: NAME, prefix: PREFIX })
    // .use(LoginRoutes)
    .use(HealthHandler);
