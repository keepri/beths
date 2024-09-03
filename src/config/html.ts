import { html as elysiaHtml } from "@elysiajs/html";

export function html() {
    return elysiaHtml({
        autoDoctype: "full",
        autoDetect: false,
    });
}
