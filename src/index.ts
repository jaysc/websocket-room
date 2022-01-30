import Fastify from "fastify";
import * as _ from "lodash-es";

import { Database } from "./database/index.js";
import { ParseData } from "./websocket/index.js";
import fws, { SocketStream } from "fastify-websocket";
import fc from "fastify-cookie";
import { User } from "./user/index.js";
import { Rooms } from "./room/index.js";

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

global.rooms = new Rooms();
global.connections = new Map<string, connection>();

server.route({
  method: "GET",
  url: "/ws",
  wsHandler: (con: connection, request) => {
    //'Connection' event
    if (!con.user) {
      //Retrieve existing user here from cookie (or maybe session id)
      const userId = request.cookies.userId;
      con.user = new User(userId);

      global.connections.set(con.user.id, con);
    }

    //I believe fastify-websocket only emits 'message' and 'close'. Need to examine other ways to handle this, potentially manually
    con.socket.on("message", (message) => {
      console.log(con.user);

      if (!con.user) {
        const userId = request.cookies.userId;
        con.user = new User(userId);
      }

      const action = ParseData(message, con.user);

      if (action == null) {
        //Not json, do nothing.
        return;
      }

      const result = action.execute(server.websocketServer);

      console.log(result);
      con.socket.send(
        JSON.stringify({
          message: result.message,
          err: result.err?.message,
        })
      );
    });

    con.socket.on("close", () => {
      if (con.user) {
        con.user.leaveRoom();
        global.connections.delete(con.user.id);
      }
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

export type Result<T, Error> = {
  ok: T;
  error: Error;
};