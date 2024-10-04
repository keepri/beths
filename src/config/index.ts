import { Elysia } from "elysia";

import { BearerConfig } from "./bearer";
import { CorrelationIdConfig } from "./correlation-id";
import { CorsConfig } from "./cors";
import { ErrorsConfig } from "./errors";

const NAME = "Config";

export const Config = new Elysia({ name: NAME })
    .use(CorsConfig)
    .use(BearerConfig)
    .use(ErrorsConfig)
    .use(CorrelationIdConfig);
