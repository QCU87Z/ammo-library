import { Router } from "express";
import { v4 as uuidv4 } from "uuid";
import { store } from "../storage/store";
import { Cartridge } from "../../../shared/types";

export const cartridgesRouter = Router();

cartridgesRouter.get("/", (_req, res) => {
  res.json(store.getData().cartridges);
});

cartridgesRouter.get("/:id", (req, res) => {
  const cartridge = store.getData().cartridges.find((c) => c.id === req.params.id);
  if (!cartridge) return res.status(404).json({ error: "Cartridge not found" });
  res.json(cartridge);
});

cartridgesRouter.post("/", (req, res) => {
  const now = new Date().toISOString();
  const cartridge: Cartridge = {
    id: uuidv4(),
    name: req.body.name || "",
    brand: req.body.brand || "",
    bulletWeight: req.body.bulletWeight != null ? Number(req.body.bulletWeight) : null,
    muzzleVelocity: req.body.muzzleVelocity != null ? Number(req.body.muzzleVelocity) : null,
    createdAt: now,
    updatedAt: now,
  };
  store.getData().cartridges.push(cartridge);
  store.save();
  res.status(201).json(cartridge);
});

cartridgesRouter.put("/:id", (req, res) => {
  const data = store.getData();
  const idx = data.cartridges.findIndex((c) => c.id === req.params.id);
  if (idx === -1) return res.status(404).json({ error: "Cartridge not found" });

  const cartridge = data.cartridges[idx];
  if (req.body.name !== undefined) cartridge.name = req.body.name;
  if (req.body.brand !== undefined) cartridge.brand = req.body.brand;
  if (req.body.bulletWeight !== undefined)
    cartridge.bulletWeight = req.body.bulletWeight != null ? Number(req.body.bulletWeight) : null;
  if (req.body.muzzleVelocity !== undefined)
    cartridge.muzzleVelocity = req.body.muzzleVelocity != null ? Number(req.body.muzzleVelocity) : null;
  cartridge.updatedAt = new Date().toISOString();
  store.save();
  res.json(cartridge);
});

cartridgesRouter.delete("/:id", (req, res) => {
  const data = store.getData();
  const idx = data.cartridges.findIndex((c) => c.id === req.params.id);
  if (idx === -1) return res.status(404).json({ error: "Cartridge not found" });
  data.cartridges.splice(idx, 1);
  store.save();
  res.status(204).send();
});
