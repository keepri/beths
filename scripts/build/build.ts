import { build, file, spawn, spawnSync, write } from "bun";

import { IS_PRODUCTION } from "@/config/env";
import { buildDir, staticDir } from "@/config/lib";

import { buildJs, extractDependencies } from "./lib";

const DOT_ENV = file(".env");
const PACKAGE_JSON = file("package.json");
const DEPS = await extractDependencies(PACKAGE_JSON);

// build server
await build({
    target: "bun",
    entrypoints: ["main.ts"],
    outdir: buildDir(),
    minify: IS_PRODUCTION,
    // we are concatting these dependencies for Lucia auth
    external: DEPS.concat(["@node-rs/argon2", "@node-rs/bcrypt"]),
});

await buildJs();

await write(file(buildDir("package.json")), await PACKAGE_JSON.arrayBuffer());
await write(file(buildDir(".env")), await DOT_ENV.arrayBuffer());

spawnSync(["bun", "tw"]);
spawn({ cmd: ["cp", "-fRL", staticDir(), buildDir()] });
