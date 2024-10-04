import { Elysia } from "elysia";

import { RootPagesController } from "@/controllers/page/controller";

const NAME = "Route.Pages";

export const PagesRoutes = new Elysia({ name: NAME }).use(RootPagesController);
