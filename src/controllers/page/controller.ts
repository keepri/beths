import { Controller } from "../lib/base-controller";
import { handleHome } from "./handlers/home";

export class PageController extends Controller {
    static get home() {
        return this.handleRequest(handleHome);
    }
}
