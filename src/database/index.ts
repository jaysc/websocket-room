import { join } from "path";
import { Low, JSONFile } from "lowdb";

import { fileURLToPath } from "node:url";
import path from "node:path";

import * as _ from "lodash-es";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

export class Database<Type extends Object> {
    database: Low<Type>;

    constructor() {
        const file = join(__dirname, "db.json");
        const adapter = new JSONFile<Type>(file);
        this.database = new Low<Type>(adapter);
    }

    public async init() {
        this.database.data = {} as Type;

        await this.database.write();
    }

    public async write(path: string, value: string | number | boolean | null) {
        this.database.read();

        _.set(this.database.data as object, path, value);

        await this.database.write();
    }
}