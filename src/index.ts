import Fastify from "fastify";
import * as _ from "lodash-es";

import { Database } from "./database/index.js";
import fws, { SocketStream } from "fastify-websocket";
import fc from "fastify-cookie";
import { User } from "./user/index.js";
import { Rooms } from "./room/index.js";
import { WsHandler } from "./websocket/wsHandler.js";

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
  wsHandler: WsHandler(server),
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