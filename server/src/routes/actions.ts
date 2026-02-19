import { Router } from "express";
import { v4 as uuidv4 } from "uuid";
import { store } from "../storage/store";
import { Action } from "../../../shared/types";

export const actionsRouter = Router();

actionsRouter.get("/", (_req, res) => {
  res.json(store.getData().actions);
});

actionsRouter.get("/:id", (req, res) => {
  const action = store.getData().actions.find((a) => a.id === req.params.id);
  if (!action) return res.status(404).json({ error: "Action not found" });
  const barrels = store.getData().barrels.filter((b) => b.actionId === action.id);
  res.json({ ...action, barrels });
});

actionsRouter.post("/", (req, res) => {
  const now = new Date().toISOString();
  const action: Action = {
    id: uuidv4(),
    name: req.body.name || "",
    serialNumber: req.body.serialNumber || "",
    scopeDetails: req.body.scopeDetails || "",
    notes: req.body.notes || "",
    createdAt: now,
    updatedAt: now,
  };
  store.getData().actions.push(action);
  store.save();
  res.status(201).json(action);
});

actionsRouter.put("/:id", (req, res) => {
  const data = store.getData();
  const idx = data.actions.findIndex((a) => a.id === req.params.id);
  if (idx === -1) return res.status(404).json({ error: "Action not found" });

  const action = data.actions[idx];
  const updatable = ["name", "serialNumber", "scopeDetails", "notes"] as const;
  for (const key of updatable) {
    if (req.body[key] !== undefined) {
      (action as any)[key] = req.body[key];
    }
  }
  action.updatedAt = new Date().toISOString();
  store.save();
  res.json(action);
});

actionsRouter.delete("/:id", (req, res) => {
  const data = store.getData();
  const attachedBarrels = data.barrels.filter((b) => b.actionId === req.params.id);
  if (attachedBarrels.length > 0) {
    return res.status(409).json({
      error: "Action has attached barrels. Remove or reassign them first.",
      barrelCount: attachedBarrels.length,
    });
  }
  const idx = data.actions.findIndex((a) => a.id === req.params.id);
  if (idx === -1) return res.status(404).json({ error: "Action not found" });
  data.actions.splice(idx, 1);
  store.save();
  res.status(204).send();
});
