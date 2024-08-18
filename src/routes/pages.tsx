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
    .get("/", function homePage(ctx) {
        const props: HomePageProps = {
            user: ctx.user,
        };

        return ctx.ssg(HomePage.bind(null, props), {
            tag: "home-page",
            revalidateMs: new TimeSpan(7, "d").milliseconds(),
        });
    });
