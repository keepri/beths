import { handleRequest } from "./request-handler";
import { type RequestHandler } from "./types";

export abstract class Controller {
    static handleRequest(handler: RequestHandler) {
        return handleRequest(handler);
    }
}
