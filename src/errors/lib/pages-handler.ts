import { type Elysia } from "elysia";

import { ErrorPage, type Props as ErrorPageProps } from "@/pages/error";

import { decodeError } from "./decode";

export function pagesErrorHandler(app: Elysia) {
    return app.onError(function handleError(ctx) {
        // @ts-expect-error `html` is defined but we can't InferErrorContext<App>
        const html = ctx.html;
        const error = decodeError(ctx);
        const props: ErrorPageProps = {
            code: error.errorCode,
        };
        const Page = ErrorPage(props);

        ctx.set.status = error.statusCode;

        return html(Page);
    });
}
