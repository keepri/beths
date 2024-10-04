import { Elysia } from "elysia";

import { LoggerPlugin } from "./logger";

const NAME = "Plugin";

export const Plugins = new Elysia({ name: NAME }).use(LoggerPlugin);
