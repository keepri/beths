import { build, env, file, spawn, spawnSync, write } from "bun";

import { buildDir, staticDir } from "@/config";

const PACKAGE_JSON = file("./package.json");
const DOT_ENV = file("./.env.local");
const NODE_ENV = env["NODE_ENV"] || "development";

const isProduction = NODE_ENV === "production";
const mv = isProduction ? "mv" : "cp";

const packageJson = JSON.parse(await PACKAGE_JSON.text());
const dependencies = Object.keys(packageJson.dependencies);

await build({
    root: "./",
    entrypoints: ["./main.ts"],
    outdir: buildDir(),
    minify: true,
    plugins: [],
    external: dependencies,
});

await write(file(buildDir("/package.json")), await PACKAGE_JSON.arrayBuffer());
await write(file(buildDir("/.env")), await DOT_ENV.arrayBuffer());

spawnSync(["bun", "tw"]);
spawn({ cmd: [mv, "-r", staticDir(), buildDir("/" + staticDir())] });
spawn(["bun", "install"], { cwd: buildDir() });
