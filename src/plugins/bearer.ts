import { bearer } from "@elysiajs/bearer";
import { Elysia } from "elysia";

const NAME = "Plugin.Bearer";

export const BearerPlugin = new Elysia({ name: NAME }).use(bearer());
