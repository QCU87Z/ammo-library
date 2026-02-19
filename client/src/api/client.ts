import type { AmmoBox, Action, Barrel, Components, Load } from "../../../shared/types";

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
    return request<Barrel[]>(`/barrels${qs}`);
  },
  getBarrel(id: string) {
    return request<Barrel & { boxes: AmmoBox[] }>(`/barrels/${id}`);
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
};
