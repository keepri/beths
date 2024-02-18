import { watch } from "fs";

import { buildJs } from "./lib";

const TIMEOUT_MS = 500;
let timer: Timer;

watch("src/js", { recursive: true }, function handler() {
    clearTimeout(timer);
    timer = setTimeout(buildJs, TIMEOUT_MS);
});
