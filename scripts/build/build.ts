import { build, env, file, spawn, spawnSync, write } from "bun";

import { buildDir, staticDir } from "@/config";

import { buildJs, extractDependencies, isProduction } from "./lib";

const DOT_ENV = file(".env.local");
const PACKAGE_JSON = file("package.json");
const DEPS = await extractDependencies(PACKAGE_JSON);
const MV_CMD = isProduction(env.NODE_ENV) ? "mv" : "cp";

// build server
await build({
    target: "bun",
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
