import { type Elysia } from "elysia";

import { PageController } from "@/controllers/page/controller";
import { pagesErrorHandler } from "@/errors/lib/pages-handler";
import { NotFoundError } from "@/errors/not-found";

const NAME = "Pages";
const PREFIX = "";

export function pagesRoutes(app: Elysia) {
    return app.group(PREFIX, function handleRoutes(group) {
        group.config.name = NAME;

        group
            .use(pagesErrorHandler)
            .get("/", PageController.home)
            .all("*", handleNotFound);

        return group;
    });
}

function handleNotFound() {
    throw new NotFoundError();
}
