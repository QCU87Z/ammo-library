"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.cartridgesRouter = void 0;
const express_1 = require("express");
const uuid_1 = require("uuid");
const store_1 = require("../storage/store");
exports.cartridgesRouter = (0, express_1.Router)();
exports.cartridgesRouter.get("/", (_req, res) => {
    res.json(store_1.store.getData().cartridges);
});
exports.cartridgesRouter.get("/:id", (req, res) => {
    const cartridge = store_1.store.getData().cartridges.find((c) => c.id === req.params.id);
    if (!cartridge)
        return res.status(404).json({ error: "Cartridge not found" });
    res.json(cartridge);
});
exports.cartridgesRouter.post("/", (req, res) => {
    const now = new Date().toISOString();
    const cartridge = {
        id: (0, uuid_1.v4)(),
        name: req.body.name || "",
        brand: req.body.brand || "",
        bulletWeight: req.body.bulletWeight != null ? Number(req.body.bulletWeight) : null,
        muzzleVelocity: req.body.muzzleVelocity != null ? Number(req.body.muzzleVelocity) : null,
        createdAt: now,
        updatedAt: now,
    };
    store_1.store.getData().cartridges.push(cartridge);
    store_1.store.save();
    res.status(201).json(cartridge);
});
exports.cartridgesRouter.put("/:id", (req, res) => {
    const data = store_1.store.getData();
    const idx = data.cartridges.findIndex((c) => c.id === req.params.id);
    if (idx === -1)
        return res.status(404).json({ error: "Cartridge not found" });
    const cartridge = data.cartridges[idx];
    if (req.body.name !== undefined)
        cartridge.name = req.body.name;
    if (req.body.brand !== undefined)
        cartridge.brand = req.body.brand;
    if (req.body.bulletWeight !== undefined)
        cartridge.bulletWeight = req.body.bulletWeight != null ? Number(req.body.bulletWeight) : null;
    if (req.body.muzzleVelocity !== undefined)
        cartridge.muzzleVelocity = req.body.muzzleVelocity != null ? Number(req.body.muzzleVelocity) : null;
    cartridge.updatedAt = new Date().toISOString();
    store_1.store.save();
    res.json(cartridge);
});
exports.cartridgesRouter.delete("/:id", (req, res) => {
    const data = store_1.store.getData();
    const idx = data.cartridges.findIndex((c) => c.id === req.params.id);
    if (idx === -1)
        return res.status(404).json({ error: "Cartridge not found" });
    data.cartridges.splice(idx, 1);
    store_1.store.save();
    res.status(204).send();
});
