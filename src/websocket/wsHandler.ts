import { FastifyInstance, FastifyRequest } from "fastify";
import { OnMessage } from "./onMessage.js";
import { connection } from "../index.js";
import { User } from "../user/index.js";

export const WsHandler =
  (server: FastifyInstance) => (con: connection, request: FastifyRequest) => {
    //'Connection' event
    if (!con.user) {
      //Retrieve existing user here from cookie (or maybe session id)
      const userId = request.cookies.userId;
      con.user = new User(userId);

      global.connections.set(con.user.id, con);
    }

    //I believe fastify-websocket only emits 'message' and 'close'. Need to examine other ways to handle this, potentially manually
    con.socket.on("message", OnMessage(server, con, request));

    con.socket.on("close", () => {
      if (con.user) {
        con.user.leaveRoom();
        global.connections.delete(con.user.id);
      }
    });
  };
