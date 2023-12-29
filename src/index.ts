import { Elysia } from "elysia";
import { env } from "./env";

const app = new Elysia();

app.listen({
    hostname: env.HOSTNAME,
    port: env.PORT,
}, function onInit(server) {
    console.log(`Server is running on ${server.hostname}:${server.port}`);
});
