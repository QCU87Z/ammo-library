import { Router } from "express";
import { store } from "../storage/store";

export const componentsRouter = Router();

const VALID_TYPES = ["powders", "primers", "projectiles"] as const;
type ComponentType = (typeof VALID_TYPES)[number];

function isValidType(type: string): type is ComponentType {
  return VALID_TYPES.includes(type as ComponentType);
}

componentsRouter.get("/", (_req, res) => {
  res.json(store.getData().components);
});

componentsRouter.post("/:type", (req, res) => {
  const { type } = req.params;
  if (!isValidType(type)) return res.status(400).json({ error: "Invalid component type" });
  const { name } = req.body;
  if (!name || typeof name !== "string") return res.status(400).json({ error: "Name required" });

  const list = store.getData().components[type];
  if (list.includes(name)) return res.status(409).json({ error: "Already exists" });
  list.push(name);
  list.sort();
  store.save();
  res.status(201).json(store.getData().components);
});

componentsRouter.put("/:type/:index", (req, res) => {
  const { type, index: indexStr } = req.params;
  if (!isValidType(type)) return res.status(400).json({ error: "Invalid component type" });
  const index = parseInt(indexStr, 10);
  const list = store.getData().components[type];
  if (index < 0 || index >= list.length) return res.status(404).json({ error: "Index out of range" });
  const { name } = req.body;
  if (!name || typeof name !== "string") return res.status(400).json({ error: "Name required" });
  list[index] = name;
  store.save();
  res.json(store.getData().components);
});

componentsRouter.delete("/:type/:index", (req, res) => {
  const { type, index: indexStr } = req.params;
  if (!isValidType(type)) return res.status(400).json({ error: "Invalid component type" });
  const index = parseInt(indexStr, 10);
  const list = store.getData().components[type];
  if (index < 0 || index >= list.length) return res.status(404).json({ error: "Index out of range" });
  list.splice(index, 1);
  store.save();
  res.json(store.getData().components);
});
