import { type InferContext } from "elysia";

import { type App } from "@/index";
import { HomePage, type Props } from "@/pages/home";
import { PAGE_TAG, REVALIDATE_MS } from "@/routes/lib/constants";
import { type Options } from "@/routes/lib/with-ssg";

const SSG_OPTIONS: Options = {
    tag: PAGE_TAG.HOME,
    revalidateMs: REVALIDATE_MS,
};

export async function handleHome(ctx: InferContext<App>) {
    const auth = await ctx.auth(ctx);
    const props: Props = {
        user: auth.user,
    };
    const Page = ctx.ssg(() => HomePage(props), SSG_OPTIONS);

    return ctx.html(Page);
}
