export interface Load {
    powderCharge: string;
    powder: string;
    primer: string;
    projectile: string;
}
export interface LoadHistoryEntry extends Load {
    date: string;
    notes?: string;
}
export interface RifleHistoryEntry {
    rifleId: string;
    rifleName: string;
    assignedDate: string;
    unassignedDate?: string;
}
export interface AmmoBox {
    id: string;
    brand: string;
    boxNumber: string;
    numberOfRounds: number;
    rifleId: string | null;
    status: "active" | "retired";
    currentLoad: Load | null;
    loadHistory: LoadHistoryEntry[];
    rifleHistory: RifleHistoryEntry[];
    createdAt: string;
    updatedAt: string;
}
export interface Rifle {
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
export interface Components {
    powders: string[];
    primers: string[];
    projectiles: string[];
}
export interface AppData {
    boxes: AmmoBox[];
    rifles: Rifle[];
    components: Components;
}
