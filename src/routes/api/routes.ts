import { Elysia } from "elysia";

import { API_PREFIX } from "../lib/constants";
import { V1Routes } from "./v1/routes";

const NAME = "Route.API";
const PREFIX = "/" + API_PREFIX;

export const APIRoutes = new Elysia({ name: NAME, prefix: PREFIX }).use(
    V1Routes,
);
