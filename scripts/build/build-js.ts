import { watch } from "fs";

import { buildJs } from "./lib";

const WATCH_DIR = "src/pages/components/client";
const TIMEOUT_MS = 500;

let TIMER: Timer;

// TODO after defining a new component, simply adding it to the `entry-client.tsx` file will not trigger a rebuild.
const watcher = watch(WATCH_DIR, { recursive: true }, function handler() {
    clearTimeout(TIMER);
    TIMER = setTimeout(buildJs, TIMEOUT_MS);
});

watcher.on("start", buildJs).emit("start");
watcher.off("start", buildJs);
