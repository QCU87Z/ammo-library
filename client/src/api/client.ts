import type { AmmoBox, Action, Barrel, Components, Load, SavedLoad, Cartridge, Elevation } from "../../../shared/types";

const BASE = "/api";

async function request<T>(path: string, options?: RequestInit): Promise<T> {
  const res = await fetch(`${BASE}${path}`, {
    headers: { "Content-Type": "application/json" },
    ...options,
  });
  if (res.status === 204) return undefined as T;
  if (!res.ok) {
    const err = await res.json().catch(() => ({ error: res.statusText }));
    throw new Error(err.error || res.statusText);
  }
  return res.json();
}

export const api = {
  // Boxes
  getBoxes(params?: Record<string, string>) {
    const qs = params ? "?" + new URLSearchParams(params).toString() : "";
    return request<AmmoBox[]>(`/boxes${qs}`);
  },
  getBox(id: string) {
    return request<AmmoBox>(`/boxes/${id}`);
  },
  createBox(data: Partial<AmmoBox>) {
    return request<AmmoBox>("/boxes", { method: "POST", body: JSON.stringify(data) });
  },
  updateBox(id: string, data: Partial<AmmoBox>) {
    return request<AmmoBox>(`/boxes/${id}`, { method: "PUT", body: JSON.stringify(data) });
  },
  deleteBox(id: string) {
    return request<void>(`/boxes/${id}`, { method: "DELETE" });
  },
  reloadBox(id: string, data: { newLoad: Load; numberOfRounds?: number; notes?: string }) {
    return request<AmmoBox>(`/boxes/${id}/reload`, { method: "POST", body: JSON.stringify(data) });
  },
  assignBarrel(id: string, barrelId: string | null) {
    return request<AmmoBox>(`/boxes/${id}/assign-barrel`, {
      method: "POST",
      body: JSON.stringify({ barrelId }),
    });
  },
  updateBoxStatus(id: string, status: "active" | "retired") {
    return request<AmmoBox>(`/boxes/${id}/status`, {
      method: "PATCH",
      body: JSON.stringify({ status }),
    });
  },

  // Actions
  getActions() {
    return request<Action[]>("/actions");
  },
  getAction(id: string) {
    return request<Action & { barrels: Barrel[] }>(`/actions/${id}`);
  },
  createAction(data: Partial<Action>) {
    return request<Action>("/actions", { method: "POST", body: JSON.stringify(data) });
  },
  updateAction(id: string, data: Partial<Action>) {
    return request<Action>(`/actions/${id}`, { method: "PUT", body: JSON.stringify(data) });
  },
  deleteAction(id: string) {
    return request<void>(`/actions/${id}`, { method: "DELETE" });
  },

  // Barrels
  getBarrels(params?: Record<string, string>) {
    const qs = params ? "?" + new URLSearchParams(params).toString() : "";
    return request<(Barrel & { roundCount: number })[]>(`/barrels${qs}`);
  },
  getBarrel(id: string) {
    return request<Barrel & { boxes: AmmoBox[]; roundCount: number }>(`/barrels/${id}`);
  },
  createBarrel(data: Partial<Barrel>) {
    return request<Barrel>("/barrels", { method: "POST", body: JSON.stringify(data) });
  },
  updateBarrel(id: string, data: Partial<Barrel>) {
    return request<Barrel>(`/barrels/${id}`, { method: "PUT", body: JSON.stringify(data) });
  },
  deleteBarrel(id: string) {
    return request<void>(`/barrels/${id}`, { method: "DELETE" });
  },

  // Components
  getComponents() {
    return request<Components>("/components");
  },
  addComponent(type: string, name: string) {
    return request<Components>(`/components/${type}`, {
      method: "POST",
      body: JSON.stringify({ name }),
    });
  },
  updateComponent(type: string, index: number, name: string) {
    return request<Components>(`/components/${type}/${index}`, {
      method: "PUT",
      body: JSON.stringify({ name }),
    });
  },
  deleteComponent(type: string, index: number) {
    return request<Components>(`/components/${type}/${index}`, { method: "DELETE" });
  },

  // Saved Loads
  getLoads() {
    return request<SavedLoad[]>("/loads");
  },
  getLoad(id: string) {
    return request<SavedLoad>(`/loads/${id}`);
  },
  createLoad(data: Partial<SavedLoad>) {
    return request<SavedLoad>("/loads", { method: "POST", body: JSON.stringify(data) });
  },
  updateLoad(id: string, data: Partial<SavedLoad>) {
    return request<SavedLoad>(`/loads/${id}`, { method: "PUT", body: JSON.stringify(data) });
  },
  deleteLoad(id: string) {
    return request<void>(`/loads/${id}`, { method: "DELETE" });
  },

  // Cartridges
  getCartridges() {
    return request<Cartridge[]>("/cartridges");
  },
  getCartridge(id: string) {
    return request<Cartridge>(`/cartridges/${id}`);
  },
  createCartridge(data: Partial<Cartridge>) {
    return request<Cartridge>("/cartridges", { method: "POST", body: JSON.stringify(data) });
  },
  updateCartridge(id: string, data: Partial<Cartridge>) {
    return request<Cartridge>(`/cartridges/${id}`, { method: "PUT", body: JSON.stringify(data) });
  },
  deleteCartridge(id: string) {
    return request<void>(`/cartridges/${id}`, { method: "DELETE" });
  },

  // Elevations
  getElevations(params?: Record<string, string>) {
    const qs = params ? "?" + new URLSearchParams(params).toString() : "";
    return request<Elevation[]>(`/elevations${qs}`);
  },
  getElevation(id: string) {
    return request<Elevation>(`/elevations/${id}`);
  },
  createElevation(data: Partial<Elevation>) {
    return request<Elevation>("/elevations", { method: "POST", body: JSON.stringify(data) });
  },
  updateElevation(id: string, data: Partial<Elevation>) {
    return request<Elevation>(`/elevations/${id}`, { method: "PUT", body: JSON.stringify(data) });
  },
  deleteElevation(id: string) {
    return request<void>(`/elevations/${id}`, { method: "DELETE" });
  },
};
