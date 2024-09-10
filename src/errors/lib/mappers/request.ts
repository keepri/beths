export function mapRequest<
    Req extends Request,
    Params extends Record<string, unknown>,
    Query extends Record<string, unknown>,
>(req: Req, params: Params, query: Query) {
    return {
        method: req.method,
        url: req.url,
        headers: req.headers,
        params,
        query,
        body: req.body,
    };
}
