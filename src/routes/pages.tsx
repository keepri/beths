import { type Elysia, type InferContext } from "elysia";
import { TimeSpan } from "lucia";

import { type App } from "@/index";
import { HomePage, type HomePageProps } from "@/pages";

const NAME = "Pages";
const HOME_PAGE_TAG = "home-page";
const REVALIDATE_HOME_PAGE_MS = new TimeSpan(7, "d").milliseconds();

export function pagesRoutes(app: Elysia) {
    return app.group("/", function routes(group) {
        group.config.name = NAME;

        group.get("/", async function homePage(ctx: InferContext<App>) {
            const auth = await ctx.auth(ctx);

            const props: HomePageProps = {
                user: auth.user,
            };

            return ctx.ssg(HomePage.bind(null, props), {
                tag: HOME_PAGE_TAG,
                revalidateMs: REVALIDATE_HOME_PAGE_MS,
            });
        });

        return group;
    });
}
