import { type Context, type ErrorHandler } from "elysia";

export function mapRequest<
    T extends Context | Parameters<ErrorHandler>[0] | Request,
>(ctx: T) {
    const request = ctx instanceof Request ? ctx : ctx.request;
    const headers = Object.fromEntries(request.headers.entries());
    const params = ctx instanceof Request ? {} : ctx.params;
    const query =
        ctx instanceof Request
            ? Object.fromEntries(new URL(ctx.url).searchParams.entries())
            : ctx.query;
    const cookies = request.headers.getSetCookie();

    return {
        method: request.method,
        url: request.url,
        headers,
        params,
        query,
        body: request.body,
        cookies,
    };
}
