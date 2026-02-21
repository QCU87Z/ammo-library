"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.store = void 0;
const fs_1 = __importDefault(require("fs"));
const path_1 = __importDefault(require("path"));
const uuid_1 = require("uuid");
const DATA_PATH = path_1.default.resolve(process.env.DATA_PATH || path_1.default.join(__dirname, "../../../data/data.json"));
const SEED_DATA = {
    boxes: [],
    actions: [],
    barrels: [],
    components: {
        powders: [],
        primers: [],
        projectiles: [],
    },
    loads: [],
    cartridges: [],
    elevations: [],
};
function migrateFromRifles(old) {
    if (!old.rifles || old.rifles.length === 0) {
        return {
            boxes: old.boxes || [],
            actions: old.actions || [],
            barrels: old.barrels || [],
            components: old.components || { powders: [], primers: [], projectiles: [] },
            loads: [],
            cartridges: [],
            elevations: [],
        };
    }
    const actions = [];
    const barrels = [];
    const rifleIdToBarrelId = {};
    for (const rifle of old.rifles) {
        const now = rifle.createdAt || new Date().toISOString();
        const actionId = (0, uuid_1.v4)();
        const barrelId = (0, uuid_1.v4)();
        actions.push({
            id: actionId,
            name: rifle.name,
            serialNumber: "",
            scopeDetails: rifle.scopeDetails || "",
            notes: [rifle.actionType ? `Action type: ${rifle.actionType}` : "", rifle.notes || ""]
                .filter(Boolean)
                .join("\n"),
            createdAt: now,
            updatedAt: rifle.updatedAt || now,
        });
        barrels.push({
            id: barrelId,
            actionId,
            serialNumber: "",
            caliber: rifle.caliber || "",
            barrelLength: rifle.barrelLength || "",
            twistRate: rifle.twistRate || "",
            zeroDistance: rifle.zeroDistance || "",
            notes: "",
            createdAt: now,
            updatedAt: rifle.updatedAt || now,
        });
        rifleIdToBarrelId[rifle.id] = barrelId;
    }
    // Migrate boxes: rifleId -> barrelId, rifleHistory -> barrelHistory
    const boxes = (old.boxes || []).map((box) => {
        const barrelId = box.rifleId ? rifleIdToBarrelId[box.rifleId] || null : null;
        const barrelHistory = (box.rifleHistory || []).map((h) => ({
            barrelId: rifleIdToBarrelId[h.rifleId] || h.rifleId,
            barrelName: h.rifleName || "",
            assignedDate: h.assignedDate,
            unassignedDate: h.unassignedDate,
        }));
        const { rifleId: _rid, rifleHistory: _rh, ...rest } = box;
        return { ...rest, barrelId, barrelHistory };
    });
    console.log(`Migrated ${old.rifles.length} rifle(s) -> ${actions.length} action(s) + ${barrels.length} barrel(s)`);
    return {
        boxes,
        actions,
        barrels,
        components: old.components || { powders: [], primers: [], projectiles: [] },
        loads: [],
        cartridges: [],
        elevations: [],
    };
}
class Store {
    data;
    constructor() {
        this.data = this.load();
    }
    load() {
        try {
            if (fs_1.default.existsSync(DATA_PATH)) {
                const raw = fs_1.default.readFileSync(DATA_PATH, "utf-8");
                const parsed = JSON.parse(raw);
                // Auto-migrate if old format detected
                if (parsed.rifles && !parsed.actions) {
                    const migrated = migrateFromRifles(parsed);
                    this.write(migrated);
                    return migrated;
                }
                const result = parsed;
                if (!result.loads)
                    result.loads = [];
                if (!result.cartridges)
                    result.cartridges = [];
                if (!result.elevations)
                    result.elevations = [];
                return result;
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
