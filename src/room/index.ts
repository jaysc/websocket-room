import { v4 as uuidv4 } from "uuid";

export class Room {
    private ID: string;
    private Password?: string;

    public roomName: string;

    constructor(roomName: string, password?: string) {
        this.ID = uuidv4();
        this.Password = password;

        this.roomName = roomName;
    }
}
