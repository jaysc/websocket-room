import { RawData } from "ws";
import * as _ from "lodash-es";
import { MethodRoute, Method } from "./method.js";
import { User } from "../user/index.js";

class Action {
    public data: object | string;
    public method: Method;
    public user: User;

    constructor(data: object, method: Method, user: User) {
        this.data = data;
        this.method = method;
        this.user = user;
    }

    public execute() {
        this.method(this.data);
    }
}

export const ParseData = (rawData: RawData, user: User): Action | null => {
    try {
        let parsedData = JSON.parse(rawData.toString());

        let parsedMethod = Route(_.get(_.get(parsedData, "method"), "method"));
        if (parsedMethod) {
            return new Action(_.get(parsedData, "data"), parsedMethod, user);
        }
    } catch (ex) {
        console.warn(`Error parsing data: ${ex}`);
        return null;
    }

    return null;
};

interface ConnectData extends Object {
    roomId: string;
    password?: string;
}
const Connect: Method = (data, user) => {
    //Connect to room if exists, else create new room.
};

interface DisconnectData extends Object {
    roomId?: string; //no roomId means disconnect from all
}
const Disconnect: Method = (data, user) => {
    //Disconnect from room
};

interface MessageData extends Object {
    message?: string;
}
const Message: Method = (data: MessageData, user) => {
    //send a message
};

export const Route = (method?: string): Method | null => {
    if (method == null) {
        return null;
    }
    var parsedMethod: MethodRoute =
        MethodRoute[method as keyof typeof MethodRoute];

    switch (parsedMethod) {
        case MethodRoute.Connect:
            return Connect;
            break;
        case MethodRoute.Disconnect:
            return Disconnect;
        case MethodRoute.Message:
            return Message;
        default:
            console.log(`Method not found: ${parsedMethod}`);
            break;
    }

    return null;
};
