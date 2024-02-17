import { type BunFile, build, env, file, spawn, spawnSync, write } from "bun";

import { buildDir, staticDir } from "@/config";

const DOT_ENV = file(".env.local");
const PACKAGE_JSON = file("package.json");
const DEPS = await extractDependencies(PACKAGE_JSON);
const MV_CMD = isProduction(env.NODE_ENV) ? "mv" : "cp";

// build server
await build({
    entrypoints: ["main.ts"],
    outdir: buildDir(),
    minify: true,
    external: DEPS,
});

await buildJs();

await write(file(buildDir("/package.json")), await PACKAGE_JSON.arrayBuffer());
await write(file(buildDir("/.env")), await DOT_ENV.arrayBuffer());

spawnSync(["bun", "tw"]);
spawn({ cmd: [MV_CMD, "-r", staticDir(), buildDir()] });

export async function buildJs() {
    await build({
        entrypoints: ["src/js/index.ts"],
        outdir: staticDir(),
        naming: "bundle.min.js",
        minify: true,
        external: DEPS,
    });
}

async function extractDependencies(packageJson: BunFile) {
    const text = await packageJson.text();
    const parsed_json = JSON.parse(text);
    const deps = Object.keys(parsed_json.dependencies);

    return deps;
}

function isProduction(nodeEnv: string | undefined): boolean {
    return nodeEnv === "production";
}
