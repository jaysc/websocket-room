import { WebSocketServer } from "ws";
import { Method, Result } from "./method.js";

interface DisconnectData extends Object {}
const LeaveRoom: Method = (data: DisconnectData, user): Result => {
  if (!user.room) {
    return { message: "User not in room" };
  }

  //Disconnect from room
  global.rooms.LeaveRoom(user.room, user);

  return { message: `Left room: ${user.room.name}` };
};

export default LeaveRoom;
