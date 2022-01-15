import { RawData } from "ws";
import * as _ from "lodash-es";
import { MethodRoute, Method } from "./method.js";

class Action {
    public data: object | string;
    public method: Method;

    constructor(data: object, method: Method) {
        this.data = data;
        this.method = method;
    }

    public execute() {
        this.method(this.data);
    }
}

export const ParseData = (rawData?: RawData): Action | null => {
    if (rawData == null) {
        return null;
    }

    try {
        let parsedData = JSON.parse(rawData.toString());

        let parsedMethod = Route(_.get(_.get(parsedData, "method"), "method"));
        if (parsedMethod) {
            return new Action(_.get(parsedData, "data"), parsedMethod);
        }
    } catch (ex) {
        console.warn(`Error parsing data: ${ex}`);
        return null;
    }

    return null;
};

const CreateRoom: Method = (data) => {};

export const Route = (method?: string): Method | null => {
    if (method == null) {
        return null;
    }
    var parsedMethod: MethodRoute =
        MethodRoute[method as keyof typeof MethodRoute];

    switch (parsedMethod) {
        case MethodRoute.CreateRoom:
            return CreateRoom;
            break;
        default:
            console.log(`Method not found: ${parsedMethod}`);
            break;
    }

    return null;
};
