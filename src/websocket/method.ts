import { WebSocketServer } from "ws";
import { User } from "../user";

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
