import { type InferContext } from "elysia";

import { type App } from "@/index";
import { HomePage, type Props } from "@/pages/home";
import { PAGE_TAG, REVALIDATE_MS } from "@/routes/constants";
import { type Options } from "@/routes/lib/with-ssg";

export async function handleHome(ctx: InferContext<App>) {
    const auth = await ctx.auth(ctx);
    const props: Props = {
        user: auth.user,
    };
    const options: Options = {
        tag: PAGE_TAG.HOME,
        revalidateMs: REVALIDATE_MS,
    };
    const Page = ctx.ssg(() => HomePage(props), options);

    return ctx.html(Page);
}
