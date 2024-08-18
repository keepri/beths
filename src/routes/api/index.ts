import { Elysia } from "elysia";

import { API_PREFIX } from "../constants";
import { v1Route } from "./v1";

const NAME = "API";
const PREFIX = "/" + API_PREFIX;

export const apiRoute = new Elysia({ name: NAME, prefix: PREFIX }).use(v1Route);
