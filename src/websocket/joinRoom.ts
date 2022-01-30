import { Room } from "../room/index.js";
import { User } from "../user/index.js";
import { Method, Result } from "./method.js";

type RoomInfo = Object & {
  name?: string;
  password?: string;
};

const JoinRoom: Method = (data: RoomInfo, user: User): Result => {
  const { name, password } = data;

  if (!name) {
    return { err: Error("No room name specified") };
  }

  return global.rooms.JoinRoom(user, name, password);
};

export default JoinRoom;
