import { join, dirname } from "path";
import { Low, JSONFile } from "lowdb";

import { fileURLToPath } from "node:url";
import path from "node:path";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(fileURLToPath(import.meta.url));

export type Data = {
    posts: string[]; // Expect posts to be an array of strings
};

export class database {
    database: Low<Data>;

    constructor() {
        const file = join(__dirname, "db.json");
        const adapter = new JSONFile<Data>(file);
        this.database = new Low<Data>(adapter);
    }

    public async init() {
        this.database.data = { posts: [] };

        await this.database.write();
    }

    public async write(input: string): Promise<boolean> {
        this.database.read();

        if (this.database.data != null) {
            const { posts } = this.database.data;
            posts.push(input);
            console.log("data written");
        }

        await this.database.write();

        return true;
    }
}
