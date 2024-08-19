import Elysia from "elysia";
import { TimeSpan } from "lucia";

import { initHtml } from "@/config";
import { context } from "@/context";
import { withSSG } from "@/lib/ssg";
import { HomePage, type HomePageProps } from "@/pages";

const NAME = "Pages";

export const pagesRoute = new Elysia({ name: NAME })
    .decorate("ssg", withSSG)
    .use(initHtml())
    .use(context)
    .get("/", async function homePage(ctx) {
        const auth = await ctx.auth(ctx);

        const props: HomePageProps = {
            user: auth.user,
        };

        return ctx.ssg(HomePage.bind(null, props), {
            tag: "home-page",
            revalidateMs: new TimeSpan(7, "d").milliseconds(),
        });
    });
