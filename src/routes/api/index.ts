import { Elysia } from "elysia";

import { API_PREFIX } from "../constants";
import { v1Routes } from "./v1";

const NAME = "API";
const PREFIX = "/" + API_PREFIX;

export const apiRoutes = new Elysia({ name: NAME, prefix: PREFIX }).use(
    v1Routes,
);
