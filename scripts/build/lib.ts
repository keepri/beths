import { type BunFile, build } from "bun";
// @ts-expect-error - no types
import { SolidPlugin } from "bun-plugin-solid";

import { staticDir } from "@/config";

export async function buildJs() {
    await build({
        entrypoints: ["src/lib/components/web/index.tsx"],
        outdir: staticDir(),
        naming: "bundle.min.js",
        minify: true,
        plugins: [SolidPlugin()],
    });
}

export async function extractDependencies(packageJson: BunFile) {
    const text = await packageJson.text();
    const parsed_json = JSON.parse(text);
    const deps = Object.keys(parsed_json.dependencies);

    return deps;
}
