import { v4 as uuidv4 } from "uuid";

export class User {
    public Id: string;
    constructor(userID?: string) {
        this.Id = userID ?? uuidv4();
    }
}
