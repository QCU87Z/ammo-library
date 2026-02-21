"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.loadsRouter = void 0;
const express_1 = require("express");
const uuid_1 = require("uuid");
const store_1 = require("../storage/store");
exports.loadsRouter = (0, express_1.Router)();
exports.loadsRouter.get("/", (_req, res) => {
    res.json(store_1.store.getData().loads);
});
exports.loadsRouter.get("/:id", (req, res) => {
    const load = store_1.store.getData().loads.find((l) => l.id === req.params.id);
    if (!load)
        return res.status(404).json({ error: "Saved load not found" });
    res.json(load);
});
exports.loadsRouter.post("/", (req, res) => {
    const now = new Date().toISOString();
    const load = {
        id: (0, uuid_1.v4)(),
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
    store_1.store.getData().loads.push(load);
    store_1.store.save();
    res.status(201).json(load);
});
exports.loadsRouter.put("/:id", (req, res) => {
    const data = store_1.store.getData();
    const idx = data.loads.findIndex((l) => l.id === req.params.id);
    if (idx === -1)
        return res.status(404).json({ error: "Saved load not found" });
    const load = data.loads[idx];
    const updatable = ["name", "powderCharge", "powder", "primer", "projectile", "length", "notes"];
    for (const key of updatable) {
        if (req.body[key] !== undefined) {
            load[key] = req.body[key];
        }
    }
    load.updatedAt = new Date().toISOString();
    store_1.store.save();
    res.json(load);
});
exports.loadsRouter.delete("/:id", (req, res) => {
    const data = store_1.store.getData();
    const idx = data.loads.findIndex((l) => l.id === req.params.id);
    if (idx === -1)
        return res.status(404).json({ error: "Saved load not found" });
    data.loads.splice(idx, 1);
    store_1.store.save();
    res.status(204).send();
});
