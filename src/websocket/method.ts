export enum MethodRoute {
    CreateRoom,
}

export type Method = (data?: object | string) => void;
