import { type BunFile, file, spawnSync } from "bun";
import { join } from "path";
import { type JSX } from "solid-js";
import { renderToStringAsync } from "solid-js/web";

import { IS_PRODUCTION, buildDir, staticDir } from "@/config";

type Options = {
    tag: string;
    revalidateMs?: number;
    disabled?: boolean;
};

export async function withSSG(
    Page: () => JSX.Element,
    options: Options,
): Promise<string | JSX.Element> {
    options.disabled ??= !IS_PRODUCTION;

    if (options.disabled) {
        return Page();
    }

    const cachePath = join(buildDir(), staticDir(), "pages");

    if (!(await file(cachePath).exists())) {
        spawnSync(["mkdir", "-p", cachePath]);
    }

    const pageFilePath = `${cachePath}/${options.tag}.html`;
    const cachedFile = file(pageFilePath);
    const fileExists = await cachedFile.exists();

    if (!fileExists) {
        return await renderPage(Page, cachedFile);
    }

    // TODO stream the file instead of reading it all at once
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
    return await renderToStringAsync(Page).then((html) => {
        html = html.replaceAll("&lt;", "<").replaceAll("&gt;", ">");

        const writer = file.writer();
        writer.write(html);
        writer.end();

        return html;
    });
}
