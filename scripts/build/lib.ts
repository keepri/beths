import { type BunFile, build } from "bun";
// @ts-expect-error - no types
import { SolidPlugin } from "bun-plugin-solid";

import { IS_PRODUCTION } from "@/config/env";
import { staticDir } from "@/config/lib";

export async function buildJs() {
    await build({
        entrypoints: ["src/components/client/web/index.tsx"],
        outdir: staticDir(),
        naming: "bundle.min.js",
        minify: IS_PRODUCTION,
        plugins: [SolidPlugin()],
    });
}

export async function extractDependencies(packageJson: BunFile) {
    const text = await packageJson.text();
    const parsed_json = JSON.parse(text);
    const deps = Object.keys(parsed_json.dependencies);

    return deps;
}
