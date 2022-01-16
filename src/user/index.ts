import { v4 as uuidv4 } from "uuid";

export class User {
    private ID: string;
    constructor(userID?: string) {
        this.ID = userID ?? uuidv4();
    }
}
