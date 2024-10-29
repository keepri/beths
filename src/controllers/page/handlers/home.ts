import { Elysia } from "elysia";

import { HomePage } from "@/pages/home";
import { HtmlPlugin, type SSGOptions } from "@/plugins/html/plugin";
import { REVALIDATE_MS } from "@/routes/lib/constants";

const NAME = "Handler.HomePage";
const PATH = "/";
const SSG_OPTIONS = {
    tag: "home-page",
    revalidateMs: REVALIDATE_MS,
} as const satisfies SSGOptions;

export const HomePageHandler = new Elysia({ name: NAME })
    .use(HtmlPlugin)
    .get(PATH, function handleHome(ctx) {
        const Page = ctx.ssg(HomePage, SSG_OPTIONS);

        return ctx.html(Page);
    });
