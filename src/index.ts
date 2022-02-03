import Fastify from "fastify";
import * as _ from "lodash-es";
import * as fs from "fs";

import fws, { SocketStream } from "fastify-websocket";
import fc from "fastify-cookie";
import { User } from "./user/index.js";
import { Rooms } from "./room/index.js";
import { WsHandler } from "./websocket/wsHandler.js";
import path, { join } from "path/win32";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

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
    const file = join(__dirname, "view/index.html");

    const stream = fs.createReadStream(file);
    reply.type("text/html").send(stream);
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