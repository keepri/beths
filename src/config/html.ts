import { type HtmlOptions, html } from "@elysiajs/html";

export function initHtml(options?: HtmlOptions) {
    const base = { autoDoctype: "full" } satisfies HtmlOptions;

    return html(Object.assign(base, options));
}
