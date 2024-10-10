import { type BunFile, build } from "bun";
// @ts-expect-error - no types
import { SolidPlugin } from "bun-plugin-solid";

import { IS_PRODUCTION } from "@/config/env";
import { staticDir } from "@/config/lib";

const ENTRYPOINT = "src/entry-client.tsx";
const NAME = "bundle.min.js";

export async function buildJs() {
    await build({
        entrypoints: [ENTRYPOINT],
        outdir: staticDir(),
        naming: NAME,
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
