export const APP_NAME = "App";

const STATIC_DIR = "static";
export function staticDir(path: string = ""): string {
    return STATIC_DIR + path;
}

// when changing this, also change package.json `start` script
const OUT_DIR = ".out";
export function buildDir(path: string = ""): string {
    return OUT_DIR + path;
}
