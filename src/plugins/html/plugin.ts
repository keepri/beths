import { type HtmlOptions, html } from "@elysiajs/html";
import { file } from "bun";
import { Elysia } from "elysia";
import { join } from "path";
import { type JSX } from "solid-js";

import { IS_PRODUCTION } from "@/config/env";
import { pagesCacheDir } from "@/config/lib";
import { type SSGPageTag } from "@/routes/lib/types";

import { render } from "./lib/render";

const NAME = "Plugin.Html";
const CONFIG = {
    autoDoctype: "full",
    autoDetect: false,
} as const satisfies HtmlOptions;

export type SSGOptions = {
    enabled?: boolean;
    tag: SSGPageTag;
    revalidateMs?: number;
};

export const HtmlPlugin = new Elysia({ name: NAME })
    .use(html(CONFIG))
    .decorate({
        async ssg(Page: () => JSX.Element, options: SSGOptions) {
            options.enabled ??= IS_PRODUCTION;

            if (!options.enabled) {
                return render(Page);
            }

            const cachePath = await pagesCacheDir();
            const pageFilePath = join(cachePath, options.tag + ".html");
            const cacheFile = file(pageFilePath);

            if (typeof options.revalidateMs === "number") {
                const diff = Date.now() - cacheFile.lastModified;
                if (diff >= options.revalidateMs) {
                    return render(Page, cacheFile);
                }
            }

            const fileExists = await cacheFile.exists();
            if (fileExists) {
                return cacheFile.text();
            }

            return render(Page, cacheFile);
        },
    });
