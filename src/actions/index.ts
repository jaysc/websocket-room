import { WebSocketServer } from "ws";
import { User } from "../user/index.js";

export enum MethodRoute {
  JoinRoom,
  LeaveRoom,
  Message,
}

export type Result = {
  message?: string;
  err?: Error;
};

export interface Method {
  (data: object, user: User, ws: WebSocketServer): Result;
}

export { JoinRoom } from "./joinRoom.js";
export { LeaveRoom } from "./leaveRoom.js";
export { Message } from "./message.js";
