import { RawData, WebSocket, WebSocketServer } from "ws";
import * as _ from "lodash-es";
import { MethodRoute, Method, Result } from "./method.js";
import { User } from "../user/index.js";
import JoinRoom from "./joinRoom.js";
import LeaveRoom from "./leaveRoom.js";
import Message from "./message.js";

class Action {
  public data: object;
  public method: Method;
  public methodName: string;
  public user: User;

  constructor(data: object, methodName: string, method: Method, user: User) {
    this.data = data;
    this.methodName = methodName;
    this.method = method;
    this.user = user;
  }

  public execute(ws: WebSocketServer): Result {
    console.log(`Executing method ${this.methodName}`);
    return this.method(this.data, this.user, ws);
  }
}

export const ParseData = (payload: RawData, user: User): Action | null => {
  try {
    let parsedData = JSON.parse(payload.toString());
    console.log(parsedData);
    const methodName = _.get(parsedData, "method");

    let parsedMethod = Route(methodName);
    if (parsedMethod) {
      return new Action(
        _.get(parsedData, "data"),
        methodName,
        parsedMethod,
        user
      );
    }
  } catch (ex) {
    console.warn(`Error parsing data:`, payload.toString());
    console.warn("Exception:", ex);
    return null;
  }

  return null;
};

export const Route = (method?: string): Method | null => {
  if (method == null) {
    return null;
  }
  var parsedMethod: MethodRoute =
    MethodRoute[method as keyof typeof MethodRoute];

  switch (parsedMethod) {
    case MethodRoute.JoinRoom:
      return JoinRoom;
    case MethodRoute.LeaveRoom:
      return LeaveRoom;
    case MethodRoute.Message:
      return Message;
    default:
      console.log(`Method not found: ${parsedMethod}`);
      break;
  }

  return null;
};
