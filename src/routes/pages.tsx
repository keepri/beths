import { Elysia, type InferContext } from "elysia";
import { TimeSpan } from "lucia";

import { initHtml } from "@/config";
import { type App } from "@/index";
import { withSSG } from "@/lib/ssg";
import { HomePage, type HomePageProps } from "@/pages";

const NAME = "Pages";

export const pagesRoutes = new Elysia({ name: NAME })
    .decorate("ssg", withSSG)
    .use(initHtml())
    .get("/", async function homePage(ctx: InferContext<App>) {
        const auth = await ctx.auth(ctx);

        const props: HomePageProps = {
            user: auth.user,
        };

        return ctx.ssg(HomePage.bind(null, props), {
            tag: "home-page",
            revalidateMs: new TimeSpan(7, "d").milliseconds(),
        });
    });
