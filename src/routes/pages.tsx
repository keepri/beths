import { type Elysia } from "elysia";

import { handleHome } from "@/handlers/pages/home";

export function pagesRoutes(app: Elysia) {
    return app.get("/", handleHome);
}
