import { Elysia } from "elysia";

const NAME = "Handler.Health";
const PATH = "/healthz";

export const HealthHandler = new Elysia({ name: NAME }).get(
    PATH,
    function handleHealth() {
        return "Coolcoolcool!";
    },
);
