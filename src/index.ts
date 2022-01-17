import Fastify from "fastify";
import { Database } from "./database/index.js";
import { ParseData } from "./websocket/index.js";
import fws, { SocketStream } from "fastify-websocket";
import fc from "fastify-cookie";
import { User } from "./user/index.js";

const server = Fastify({
    logger: true,
});
server.register(fws, {
    options: {
        clientTracking: true,
    },
});
server.register(fc, {
    secret: "secret",
});

server.get("/ping", async (request, reply) => {
    return "pong\n";
});

const db = new Database();
db.reset();

//Websocket stuff should be moved to it's own controller.
export type connection = SocketStream & {
    user?: User;
    roomId?: string;
};

server.route({
    method: "GET",
    url: "/ws",
    wsHandler: (con: connection, request) => {
        //'Connection' event
        if (!con.user) {
            //Retrieve existing user here from cookie (or maybe session id)
            const userId = request.cookies.userId;
            con.user = new User(userId);
        }

        console.log(con.user);

        //I believe fastify-websocket only emits 'message' and 'close'. Need to examine other ways to handle this, potentially manually
        con.socket.on("message", (message) => {
            console.log("User message");

            server.websocketServer.clients;
            const action = ParseData(message, new User());

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
        console.log("http hit");
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
