import { type Elysia } from "elysia";

import { PageController } from "@/controllers/page/controller";

const NAME = "Pages";
const PREFIX = "";

export function pagesRoutes(app: Elysia) {
    return app.group(PREFIX, function handleRoutes(group) {
        group.config.name = NAME;

        group.get("/", PageController.home);

        return group;
    });
}
