import Fastify from "fastify";
import * as ws from "fastify-websocket";
import { database } from "./database/index.js";
import fws from "fastify-websocket";

const server = Fastify({
    logger: true,
});
server.register(fws);

server.get("/ping", async (request, reply) => {
    return "pong\n";
});

const db = new database();
db.init();

server.get("/ws", { websocket: true }, (connection, request) => {
    connection.socket.on("message", (message) => {
        db.write(message.toString());
        console.log(message.toString());
        connection.socket.send("hi from server");
    });
});

server.listen(8080, (err, address) => {
    if (err) {
        console.error(err);
        process.exit(1);
    }

    console.log(`Server listening at ${address}`);
});
