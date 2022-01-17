import _ from "lodash";
import { v4 as uuidv4 } from "uuid";
import { connection } from "..";
import { User } from "../user";

export class Room {
    private Id: string;
    private Password?: string;
    public userIds: Array<string> = [];

    public roomName: string;

    constructor(roomName: string, password?: string) {
        this.Id = uuidv4();
        this.Password = password;

        this.roomName = roomName;
    }

    public AddUser(user: User) {
        this.userIds.push(user.Id);
    }

    public RemoveUser(user: User) {
        _.remove(this.userIds, (x) => {
            return x == user.Id;
        });
    }

    public SendMessage(clients: Set<connection>, message: string) {
        _.forEach(this.userIds, (userId) => {
            clients.forEach((ws) => {
                if (ws.user?.Id == userId) {
                    ws.socket.send(message);
                }
            });
        });
    }
}
