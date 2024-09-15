import { Controller } from "../lib/base-controller";
import { handleCallback } from "./handlers/callback";
import { handleLogin } from "./handlers/login";

export class GithubController extends Controller {
    static get login() {
        return this.handleRequest(handleLogin);
    }

    static get callback() {
        return this.handleRequest(handleCallback);
    }
}
