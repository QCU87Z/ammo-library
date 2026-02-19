"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.store = void 0;
const fs_1 = __importDefault(require("fs"));
const path_1 = __importDefault(require("path"));
const DATA_PATH = path_1.default.resolve(process.env.DATA_PATH || path_1.default.join(__dirname, "../../../data/data.json"));
const SEED_DATA = {
    boxes: [],
    rifles: [],
    components: {
        powders: [],
        primers: [],
        projectiles: [],
    },
};
class Store {
    data;
    constructor() {
        this.data = this.load();
    }
    load() {
        try {
            if (fs_1.default.existsSync(DATA_PATH)) {
                const raw = fs_1.default.readFileSync(DATA_PATH, "utf-8");
                return JSON.parse(raw);
            }
        }
        catch (err) {
            console.error("Failed to read data file, using seed data:", err);
        }
        this.write(SEED_DATA);
        return { ...SEED_DATA };
    }
    write(data) {
        const dir = path_1.default.dirname(DATA_PATH);
        if (!fs_1.default.existsSync(dir)) {
            fs_1.default.mkdirSync(dir, { recursive: true });
        }
        fs_1.default.writeFileSync(DATA_PATH, JSON.stringify(data, null, 2), "utf-8");
    }
    save() {
        this.write(this.data);
    }
    getData() {
        return this.data;
    }
}
exports.store = new Store();
