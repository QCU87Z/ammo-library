export interface Load {
  powderCharge: string;
  powder: string;
  primer: string;
  projectile: string;
  length: string;
}

export interface LoadHistoryEntry extends Load {
  date: string;
  notes?: string;
}

export interface BarrelHistoryEntry {
  barrelId: string;
  barrelName: string;
  assignedDate: string;
  unassignedDate?: string;
}

export interface AmmoBox {
  id: string;
  brand: string;
  boxNumber: string;
  numberOfRounds: number;
  barrelId: string | null;
  status: "active" | "retired";
  currentLoad: Load | null;
  loadHistory: LoadHistoryEntry[];
  barrelHistory: BarrelHistoryEntry[];
  createdAt: string;
  updatedAt: string;
}

export interface Action {
  id: string;
  name: string;
  serialNumber: string;
  scopeDetails: string;
  notes: string;
  createdAt: string;
  updatedAt: string;
}

export interface Barrel {
  id: string;
  actionId: string | null;
  serialNumber: string;
  caliber: string;
  barrelLength: string;
  twistRate: string;
  zeroDistance: string;
  notes: string;
  createdAt: string;
  updatedAt: string;
}

export interface Components {
  powders: string[];
  primers: string[];
  projectiles: string[];
}

export interface SavedLoad {
  id: string;
  name: string;
  powderCharge: string;
  powder: string;
  primer: string;
  projectile: string;
  length: string;
  notes: string;
  createdAt: string;
  updatedAt: string;
}

export interface AppData {
  boxes: AmmoBox[];
  actions: Action[];
  barrels: Barrel[];
  components: Components;
  loads: SavedLoad[];
}
