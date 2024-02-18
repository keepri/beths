import Elysia from "elysia";

import { initHtml } from "@/config";
import { HomePage } from "@/js/pages";

export const pages = new Elysia({ name: "Pages" })
    .use(initHtml())
    .get("/", function homePage() {
        return <HomePage />;
    });
