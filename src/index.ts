import Fastify from "fastify";
import { Database } from "./database/index.js";
import { ParseData } from "./websocket/index.js";
import fws from "fastify-websocket";

const server = Fastify({
    logger: true,
});
server.register(fws, {
    options: {
        clientTracking: true,
    },
});

server.get("/ping", async (request, reply) => {
    return "pong\n";
});

const db = new Database();
db.reset();

server.route({
    method: "GET",
    url: "/ws",
    wsHandler: (con, request) => {
        con.socket.on("upgrade", (req) => {});

        con.socket.on("message", (message) => {
            const action = ParseData(message);

            if (action == null) {
                //Not json, do nothing.
                return;
            }

            action.execute();
            
            con.socket.send("hi from server");
        });

        con.socket.on("close", () => {
            console.log("Closed");
        });
    },
    handler: (req, reply) => {
        reply.send({ hello: "world" });
    },
});

server.listen(8080, (err, address) => {
    if (err) {
        console.error(err);
        process.exit(1);
    }

    console.log(`Server listening at ${address}`);
});
