import { type BunFile } from "bun";
import { type JSX } from "solid-js";
import { renderToString } from "solid-js/web";

export function render(Page: () => JSX.Element, file?: BunFile) {
    const html = renderToString(Page)
        .replaceAll("&lt;", "<")
        .replaceAll("&gt;", ">")
        .replaceAll("&amp;", "&");

    if (file) {
        const writer = file.writer();
        writer.write(html);
        writer.end();
    }

    return html;
}
