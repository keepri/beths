import Elysia from "elysia";

import { HomePageHandler } from "./handlers/home";

const NAME = "Controller.RootPages";

export const RootPagesController = new Elysia({ name: NAME }).use(
    HomePageHandler,
);
