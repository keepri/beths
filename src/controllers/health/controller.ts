import { Controller } from "../lib/base-controller";
import { handleHealth } from "./handlers/health";

export class HealthController extends Controller {
    static get health() {
        return this.handleRequest(handleHealth);
    }
}
