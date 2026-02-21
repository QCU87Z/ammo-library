"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.riflesRouter = void 0;
const express_1 = require("express");
const uuid_1 = require("uuid");
const store_1 = require("../storage/store");
exports.riflesRouter = (0, express_1.Router)();
exports.riflesRouter.get("/", (_req, res) => {
    res.json(store_1.store.getData().rifles);
});
exports.riflesRouter.get("/:id", (req, res) => {
    const rifle = store_1.store.getData().rifles.find((r) => r.id === req.params.id);
    if (!rifle)
        return res.status(404).json({ error: "Rifle not found" });
    const boxes = store_1.store.getData().boxes.filter((b) => b.rifleId === rifle.id);
    res.json({ ...rifle, boxes });
});
exports.riflesRouter.post("/", (req, res) => {
    const now = new Date().toISOString();
    const rifle = {
        id: (0, uuid_1.v4)(),
        name: req.body.name || "",
        caliber: req.body.caliber || "",
        barrelLength: req.body.barrelLength || "",
        twistRate: req.body.twistRate || "",
        actionType: req.body.actionType || "",
        scopeDetails: req.body.scopeDetails || "",
        zeroDistance: req.body.zeroDistance || "",
        notes: req.body.notes || "",
        createdAt: now,
        updatedAt: now,
    };
    store_1.store.getData().rifles.push(rifle);
    store_1.store.save();
    res.status(201).json(rifle);
});
exports.riflesRouter.put("/:id", (req, res) => {
    const data = store_1.store.getData();
    const idx = data.rifles.findIndex((r) => r.id === req.params.id);
    if (idx === -1)
        return res.status(404).json({ error: "Rifle not found" });
    const rifle = data.rifles[idx];
    const updatable = [
        "name", "caliber", "barrelLength", "twistRate",
        "actionType", "scopeDetails", "zeroDistance", "notes",
    ];
    for (const key of updatable) {
        if (req.body[key] !== undefined) {
            rifle[key] = req.body[key];
        }
    }
    rifle.updatedAt = new Date().toISOString();
    store_1.store.save();
    res.json(rifle);
});
exports.riflesRouter.delete("/:id", (req, res) => {
    const data = store_1.store.getData();
    const assignedBoxes = data.boxes.filter((b) => b.rifleId === req.params.id);
    if (assignedBoxes.length > 0) {
        return res.status(409).json({
            error: "Rifle has assigned boxes",
            boxCount: assignedBoxes.length,
        });
    }
    const idx = data.rifles.findIndex((r) => r.id === req.params.id);
    if (idx === -1)
        return res.status(404).json({ error: "Rifle not found" });
    data.rifles.splice(idx, 1);
    store_1.store.save();
    res.status(204).send();
});
