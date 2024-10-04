import { Elysia } from "elysia";

import { HomePage, type Props } from "@/pages/home";
import { HtmlPlugin, type SSGOptions } from "@/plugins/html/plugin";
import { REVALIDATE_MS } from "@/routes/lib/constants";
import { AuthService } from "@/services/auth/service";

const NAME = "Handler.HomePage";
const PATH = "/";
const SSG_OPTIONS = {
    tag: "home-page",
    revalidateMs: REVALIDATE_MS,
} as const satisfies SSGOptions;

export const HomePageHandler = new Elysia({ name: NAME })
    .use(AuthService)
    .use(HtmlPlugin)
    .get(PATH, function handleHome(ctx) {
        const props: Props = {
            user: ctx.auth.user,
        };
        const Page = ctx.ssg(() => HomePage(props), SSG_OPTIONS);

        return ctx.html(Page);
    });
