import * as _ from "lodash-es";
import { v4 as uuidv4 } from "uuid";
import { User } from "../user";
import { Result } from "../actions";

export type uuid = string & { readonly _: unique symbol };

export class Room {
  public id: uuid;
  private Password?: string;
  public userIds: Array<string> = [];

  public name: string;

  constructor(name: string, password?: string) {
    this.id = uuidv4() as uuid;
    this.Password = password;

    this.name = name;
  }

  public HasPassword = () => !_.isEmpty(this.Password);

  public PasswordAccept(password?: string) {
    if (this.HasPassword()) {
      return password === this.Password;
    }
    return false;
  }

  public AddUser(user: User) {
    this.userIds = _.union(this.userIds, [user.id]);
  }

  public RemoveUser(user: User): boolean {
    let userRemoved = false;
    _.remove(this.userIds, (x) => {
      const temp = x == user.id;
      if (!userRemoved) {
        userRemoved = temp;
      }
      return temp;
    });

    return userRemoved;
  }

  public SendMessage(message: string, user?: User) {
    _.forEach(this.userIds, (userId) => {
      if (user && user.id === userId) {
        return;
      }

      global.connections.forEach((ws) => {
        if (ws.user?.id == userId) {
          console.log(`userId: ${ws.user?.id}`);
          console.log(`userId compare: ${userId}`);
          ws.socket.send(message);
        }
      });
    });
  }
}

export class Rooms {
  private rooms: { [RoomId: uuid]: Room } = {};

  public JoinRoom(user: User, name: string, password?: string): Result {
    let room = this.FindRoomByName(name);

    if (room == null) {
      //Create room
      room = new Room(name, password);
      this.rooms[room.id] = room;

      console.log("Room created");
      user.JoinRoom(room);
    } else if (room.HasPassword()) {
      if (room.PasswordAccept(password)) {
        user.JoinRoom(room);
      } else {
        //incorrect password
        console.warn("Incorrect password");
        return new Error("Password incorrect");
      }
    } else {
      user.JoinRoom(room);
    }

    return { message: `User joined room: ${room.name}` };
  }

  public LeaveRoom(room: Room, user: User) {
    return this.FindRoomById(room.id)?.RemoveUser(user);
  }

  private FindRoomByName(name: string): Room | undefined {
    return _.find(this.rooms, (room) => {
      return room.name === name;
    });
  }

  private FindRoomById(id: uuid): Room | null {
    return this.rooms[id];
  }
}
