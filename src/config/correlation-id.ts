import { getId, withId } from "correlation-id";
import { Elysia } from "elysia";

import { CORRELATION_ID_HEADER } from "./constants";

const NAME = "Config.CorrelationId";

export const CorrelationIdConfig = new Elysia({ name: NAME })
    .derive(function (ctx) {
        withId(function () {
            const correlationId = getId()!;
            ctx.request.headers.set(CORRELATION_ID_HEADER, correlationId);
        });
    })
    .as("global");
