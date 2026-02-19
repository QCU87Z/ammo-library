import { Router } from "express";
import { v4 as uuidv4 } from "uuid";
import { store } from "../storage/store";
import { SavedLoad } from "../../../shared/types";

export const loadsRouter = Router();

loadsRouter.get("/", (_req, res) => {
  res.json(store.getData().loads);
});

loadsRouter.get("/:id", (req, res) => {
  const load = store.getData().loads.find((l) => l.id === req.params.id);
  if (!load) return res.status(404).json({ error: "Saved load not found" });
  res.json(load);
});

loadsRouter.post("/", (req, res) => {
  const now = new Date().toISOString();
  const load: SavedLoad = {
    id: uuidv4(),
    name: req.body.name || "",
    powderCharge: req.body.powderCharge || "",
    powder: req.body.powder || "",
    primer: req.body.primer || "",
    projectile: req.body.projectile || "",
    length: req.body.length || "",
    notes: req.body.notes || "",
    createdAt: now,
    updatedAt: now,
  };
  store.getData().loads.push(load);
  store.save();
  res.status(201).json(load);
});

loadsRouter.put("/:id", (req, res) => {
  const data = store.getData();
  const idx = data.loads.findIndex((l) => l.id === req.params.id);
  if (idx === -1) return res.status(404).json({ error: "Saved load not found" });

  const load = data.loads[idx];
  const updatable = ["name", "powderCharge", "powder", "primer", "projectile", "length", "notes"] as const;
  for (const key of updatable) {
    if (req.body[key] !== undefined) {
      (load as any)[key] = req.body[key];
    }
  }
  load.updatedAt = new Date().toISOString();
  store.save();
  res.json(load);
});

loadsRouter.delete("/:id", (req, res) => {
  const data = store.getData();
  const idx = data.loads.findIndex((l) => l.id === req.params.id);
  if (idx === -1) return res.status(404).json({ error: "Saved load not found" });
  data.loads.splice(idx, 1);
  store.save();
  res.status(204).send();
});
