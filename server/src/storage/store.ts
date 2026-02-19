import fs from "fs";
import path from "path";
import { v4 as uuidv4 } from "uuid";
import { AppData } from "../../../shared/types";

const DATA_PATH = path.resolve(
  process.env.DATA_PATH || path.join(__dirname, "../../../data/data.json")
);

const SEED_DATA: AppData = {
  boxes: [],
  actions: [],
  barrels: [],
  components: {
    powders: [],
    primers: [],
    projectiles: [],
  },
  loads: [],
};

interface OldRifle {
  id: string;
  name: string;
  caliber: string;
  barrelLength: string;
  twistRate: string;
  actionType: string;
  scopeDetails: string;
  zeroDistance: string;
  notes: string;
  createdAt: string;
  updatedAt: string;
}

interface OldAppData {
  boxes: any[];
  rifles?: OldRifle[];
  actions?: any[];
  barrels?: any[];
  components: any;
}

function migrateFromRifles(old: OldAppData): AppData {
  if (!old.rifles || old.rifles.length === 0) {
    return {
      boxes: old.boxes || [],
      actions: old.actions || [],
      barrels: old.barrels || [],
      components: old.components || { powders: [], primers: [], projectiles: [] },
      loads: [],
    };
  }

  const actions: AppData["actions"] = [];
  const barrels: AppData["barrels"] = [];
  const rifleIdToBarrelId: Record<string, string> = {};

  for (const rifle of old.rifles) {
    const now = rifle.createdAt || new Date().toISOString();
    const actionId = uuidv4();
    const barrelId = uuidv4();

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
  const boxes = (old.boxes || []).map((box: any) => {
    const barrelId = box.rifleId ? rifleIdToBarrelId[box.rifleId] || null : null;
    const barrelHistory = (box.rifleHistory || []).map((h: any) => ({
      barrelId: rifleIdToBarrelId[h.rifleId] || h.rifleId,
      barrelName: h.rifleName || "",
      assignedDate: h.assignedDate,
      unassignedDate: h.unassignedDate,
    }));

    const { rifleId: _rid, rifleHistory: _rh, ...rest } = box;
    return { ...rest, barrelId, barrelHistory };
  });

  console.log(
    `Migrated ${old.rifles.length} rifle(s) -> ${actions.length} action(s) + ${barrels.length} barrel(s)`
  );

  return {
    boxes,
    actions,
    barrels,
    components: old.components || { powders: [], primers: [], projectiles: [] },
    loads: [],
  };
}

class Store {
  private data: AppData;

  constructor() {
    this.data = this.load();
  }

  private load(): AppData {
    try {
      if (fs.existsSync(DATA_PATH)) {
        const raw = fs.readFileSync(DATA_PATH, "utf-8");
        const parsed = JSON.parse(raw) as OldAppData;

        // Auto-migrate if old format detected
        if (parsed.rifles && !parsed.actions) {
          const migrated = migrateFromRifles(parsed);
          this.write(migrated);
          return migrated;
        }

        const result = parsed as unknown as AppData;
        if (!result.loads) result.loads = [];
        return result;
      }
    } catch (err) {
      console.error("Failed to read data file, using seed data:", err);
    }
    this.write(SEED_DATA);
    return { ...SEED_DATA };
  }

  private write(data: AppData): void {
    const dir = path.dirname(DATA_PATH);
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
    fs.writeFileSync(DATA_PATH, JSON.stringify(data, null, 2), "utf-8");
  }

  save(): void {
    this.write(this.data);
  }

  getData(): AppData {
    return this.data;
  }
}

export const store = new Store();
