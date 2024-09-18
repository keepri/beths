import { type BunFile, file, spawnSync } from "bun";
import { join } from "path";
import { type JSX } from "solid-js";
import { renderToStringAsync } from "solid-js/web";

import { buildDir, staticDir } from "@/config";
import { IS_PRODUCTION } from "@/config/env";

import { type PAGE_TAG } from "./constants";

export type Options = {
    tag: PAGE_TAG;
    revalidateMs?: number;
    enabled?: boolean;
};

export async function withSSG(Page: JSX.Element, options: Options) {
    options.enabled ??= IS_PRODUCTION;

    if (!options.enabled) {
        return render(Page);
    }

    const cachePath = await pagesCachePath();
    const pageFilePath = `${cachePath}/${options.tag}.html`;
    const cacheFile = file(pageFilePath);

    if (typeof options.revalidateMs === "number") {
        const diff = Date.now() - cacheFile.lastModified;
        if (diff > options.revalidateMs) {
            return render(Page, cacheFile);
        }
    }

    const fileExists = await cacheFile.exists();
    if (fileExists) {
        return cacheFile.text();
    }

    return render(Page, cacheFile);
}

async function render(Page: JSX.Element, file?: BunFile) {
    const html = (await renderToStringAsync(Page))
        .replaceAll("&lt;", "<")
        .replaceAll("&gt;", ">");

    if (file) {
        const writer = file.writer();
        writer.write(html);
        writer.end();
    }

    return html;
}

async function pagesCachePath() {
    const path = join(buildDir(), staticDir(), "pages");
    const directoryExists = await file(path).exists();

    if (!directoryExists) {
        spawnSync(["mkdir", "-p", path]);
    }

    return path;
}
