import { Elysia } from "elysia";

import { LoginCallbackHandler } from "./handlers/callback";
import { LoginHandler } from "./handlers/login";

const NAME = "Controller.Github";

export const GithubController = new Elysia({ name: NAME })
    .use(LoginHandler)
    .use(LoginCallbackHandler);
