import { build, file, spawn, spawnSync, write } from "bun";

import { buildDir, staticDir } from "@/config";
import { IS_PRODUCTION } from "@/config/env";

import { buildJs, extractDependencies } from "./lib";

const DOT_ENV = file(".env");
const PACKAGE_JSON = file("package.json");
const DEPS = await extractDependencies(PACKAGE_JSON);
const MV_CMD = IS_PRODUCTION ? "mv" : "cp";

// build server
await build({
    target: "bun",
    entrypoints: ["main.ts"],
    outdir: buildDir(),
    minify: true,
    // we are concatting these dependencies for Lucia auth
    external: DEPS.concat(["@node-rs/argon2", "@node-rs/bcrypt"]),
});

await buildJs();

await write(file(buildDir("package.json")), await PACKAGE_JSON.arrayBuffer());
await write(file(buildDir(".env")), await DOT_ENV.arrayBuffer());

spawnSync(["bun", "tw"]);

if (IS_PRODUCTION) {
    spawnSync(["rm", staticDir("main.css")]);
}

spawn({ cmd: [MV_CMD, "-r", staticDir(), buildDir()] });
