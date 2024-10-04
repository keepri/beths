import { Elysia } from "elysia";

import { ErrorPage, type Props as ErrorPageProps } from "@/pages/error";
import {
    NotFoundPage,
    type Props as NotFoundPageProps,
} from "@/pages/not-found";
import { HtmlPlugin } from "@/plugins/html/plugin";
import { LoggerPlugin } from "@/plugins/logger";

import { mapErrorContext } from "../mappers/error-context";

const NAME = "Handler.Error";

export const RouteErrorHandler = new Elysia({ name: NAME })
    .use(LoggerPlugin)
    .use(HtmlPlugin)
    .onError(function handleError(ctx) {
        const { error, request } = mapErrorContext(ctx);

        ctx.log!.error(
            {
                name: error.name,
                cause: error.cause,
                statusCode: error.statusCode,
                errorCode: error.errorCode,
                ...error.metadata,
                stack: error.stack,
                requestInfo: request,
            },
            error.message,
        );

        ctx.set.status = error.statusCode;

        if (error.statusCode === 404) {
            const props: NotFoundPageProps = {
                code: error.errorCode,
            };
            const Page = ctx.ssg(() => NotFoundPage(props), {
                tag: "not-found-page",
            });

            // @ts-expect-error `html` is defined
            return ctx.html(Page);
        }

        const props: ErrorPageProps = {
            code: error.errorCode,
        };
        // TODO this could be cached based on an `errorCode` hash
        const Page = ErrorPage(props);

        // @ts-expect-error `html` is defined
        return ctx.html(Page);
    })
    .as("plugin");
