import { type Elysia, type InferContext } from "elysia";

import { type App } from "@/index";
import { HomePage, type HomePageProps } from "@/pages";

import { PAGE_TAG, REVALIDATE_MS } from "./constants";

export function pagesRoutes(app: Elysia) {
    return app.get("/", async function handleHomePage(ctx: InferContext<App>) {
        const auth = await ctx.auth(ctx);
        const props: HomePageProps = {
            user: auth.user,
        };
        const Page = ctx.ssg(() => HomePage(props), {
            tag: PAGE_TAG.HOME,
            revalidateMs: REVALIDATE_MS,
        });

        return ctx.html(Page);
    });
}
