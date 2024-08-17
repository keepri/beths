import Elysia from "elysia";
import { TimeSpan } from "lucia";

import { initHtml } from "@/config";
import { context } from "@/context";
import { withSSG } from "@/lib/ssg";
import { HomePage, type HomePageProps } from "@/pages";

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
