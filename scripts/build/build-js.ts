import { watch } from "fs";

import { buildJs } from "./lib";

const TIMEOUT_MS = 500;
let timer: Timer;

const watcher = watch(
    "src/components/client/web",
    { recursive: true },
    function handler() {
        clearTimeout(timer);
        timer = setTimeout(buildJs, TIMEOUT_MS);
    },
);

watcher.on("start", buildJs).emit("start");
watcher.off("start", buildJs);
