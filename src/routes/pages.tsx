import Elysia from "elysia";

import { initHtml } from "@/config";
import { HomePage } from "@/lib/pages";
import { withSSG } from "@/lib/ssg";
import { Millis } from "@/lib/time";

export const pages = new Elysia({ name: "Pages" })
    .decorate("ssg", withSSG)
    .use(initHtml())
    .get("/", async function homePage(ctx) {
        const page = await ctx.ssg(HomePage, {
            tag: "home-page",
            revalidateMs: Millis.day(7),
        });

        return page;
    });
