import { cors } from "@elysiajs/cors";
import { Elysia } from "elysia";

import { origin } from "./lib";

const NAME = "Config.Cors";
const CONFIG: Parameters<typeof cors>[0] = {
    allowedHeaders: "*",
    origin: [origin(), "https://github.com"],
    credentials: true,
} as const;

export const CorsConfig = new Elysia({ name: NAME }).use(cors(CONFIG));
