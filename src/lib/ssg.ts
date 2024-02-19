import { type BunFile, file, spawnSync } from "bun";
import { join } from "path";
import { type JSX } from "solid-js";
import { renderToStringAsync } from "solid-js/web";

import { buildDir, staticDir } from "@/config";

export async function withSSG(
    Page: () => JSX.Element,
    options: { tag: string; revalidateMs?: number },
): Promise<string> {
    const cachePath = join(buildDir(), staticDir(), "pages");

    if (!(await file(cachePath).exists())) {
        spawnSync(["mkdir", "-p", cachePath]);
    }

    const cachedFile = file(`${cachePath}/${options.tag}.html`);

    if (!(await cachedFile.exists())) {
        return await renderPage(Page, cachedFile);
    }

    let html = await cachedFile.text();

    if (options.revalidateMs) {
        const diff = Date.now() - cachedFile.lastModified;

        if (diff > options.revalidateMs) {
            html = await renderPage(Page, cachedFile);
        }
    }

    return html;
}

async function renderPage<T extends object>(
    Page: (props?: T) => JSX.Element,
    file: BunFile,
) {
    return await renderToStringAsync(() => Page()).then(async (html) => {
        html = html.replaceAll("&lt;", "<").replaceAll("&gt;", ">");

        const writer = file.writer();
        writer.write(html);
        writer.end();

        return html;
    });
}
