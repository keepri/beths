import { bearer } from "@elysiajs/bearer";
import { Elysia } from "elysia";

const NAME = "Config.Bearer";

export const BearerConfig = new Elysia({ name: NAME }).use(bearer());
