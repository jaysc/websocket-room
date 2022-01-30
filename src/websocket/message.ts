import { WebSocketServer } from "ws";
import { User } from "../user";
import { Method, Result } from "./method";

interface MessageData extends Object {
  message?: string;
}
const Message: Method = (
  data: MessageData,
  user: User,
  ws: WebSocketServer
): Result => {
  if (!data.message) {
    return { message: "No message" };
  }

  if (!user.room) {
    return { message: "User not in room" };
  }

  //send a message
  user.room?.SendMessage(data.message, user);
  return { message: "Message Sent" };
};

export default Message;
