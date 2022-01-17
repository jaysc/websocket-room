import { User } from "../user";

export enum MethodRoute {
    Connect,
    Disconnect,
    Message,
}

export interface Method {
    (data: object, user: User): void;
}
