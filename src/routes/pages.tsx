import Elysia from "elysia";
import { TimeSpan } from "lucia";

import { initHtml } from "@/config";
import { context } from "@/context";
import { HomePage, type HomePageProps } from "@/lib/pages";
import { withSSG } from "@/lib/ssg";

export const pagesRoute = new Elysia({ name: "Pages" })
    .decorate("ssg", withSSG)
    .use(initHtml())
    .use(context)
    .get("/", async function homePage(ctx) {
        const props: HomePageProps = {
            user: ctx.user,
        };

        const page = await ctx.ssg(HomePage.bind(null, props), {
            tag: "home-page",
            revalidateMs: new TimeSpan(7, "d").milliseconds(),
        });

        return page;
    });
