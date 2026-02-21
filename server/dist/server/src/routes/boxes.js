"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.boxesRouter = void 0;
const express_1 = require("express");
const uuid_1 = require("uuid");
const store_1 = require("../storage/store");
exports.boxesRouter = (0, express_1.Router)();
exports.boxesRouter.get("/", (req, res) => {
    let boxes = store_1.store.getData().boxes;
    const { search, barrelId, status, brand } = req.query;
    if (search && typeof search === "string") {
        const q = search.toLowerCase();
        const barrels = store_1.store.getData().barrels;
        boxes = boxes.filter((b) => {
            const barrel = barrels.find((br) => br.id === b.barrelId);
            const barrelName = barrel ? `${barrel.caliber} ${barrel.barrelLength}` : "";
            return (b.boxNumber.toLowerCase().includes(q) ||
                b.brand.toLowerCase().includes(q) ||
                barrelName.toLowerCase().includes(q));
        });
    }
    if (barrelId && typeof barrelId === "string") {
        boxes = boxes.filter((b) => b.barrelId === barrelId);
    }
    if (status && typeof status === "string") {
        boxes = boxes.filter((b) => b.status === status);
    }
    if (brand && typeof brand === "string") {
        boxes = boxes.filter((b) => b.brand === brand);
    }
    res.json(boxes);
});
exports.boxesRouter.get("/:id", (req, res) => {
    const box = store_1.store.getData().boxes.find((b) => b.id === req.params.id);
    if (!box)
        return res.status(404).json({ error: "Box not found" });
    res.json(box);
});
exports.boxesRouter.post("/", (req, res) => {
    const now = new Date().toISOString();
    const box = {
        id: (0, uuid_1.v4)(),
        brand: req.body.brand || "",
        boxNumber: req.body.boxNumber || "",
        numberOfRounds: req.body.numberOfRounds || 0,
        barrelId: req.body.barrelId || null,
        status: "active",
        currentLoad: req.body.currentLoad || null,
        loadHistory: [],
        barrelHistory: [],
        createdAt: now,
        updatedAt: now,
    };
    // If a barrel is assigned, add to barrel history
    if (box.barrelId) {
        const barrel = store_1.store.getData().barrels.find((b) => b.id === box.barrelId);
        if (barrel) {
            box.barrelHistory.push({
                barrelId: barrel.id,
                barrelName: `${barrel.caliber} ${barrel.barrelLength}`.trim(),
                assignedDate: now,
            });
        }
    }
    store_1.store.getData().boxes.push(box);
    store_1.store.save();
    res.status(201).json(box);
});
exports.boxesRouter.put("/:id", (req, res) => {
    const data = store_1.store.getData();
    const box = data.boxes.find((b) => b.id === req.params.id);
    if (!box)
        return res.status(404).json({ error: "Box not found" });
    const updatable = ["brand", "boxNumber", "numberOfRounds", "currentLoad"];
    for (const key of updatable) {
        if (req.body[key] !== undefined) {
            box[key] = req.body[key];
        }
    }
    box.updatedAt = new Date().toISOString();
    store_1.store.save();
    res.json(box);
});
exports.boxesRouter.delete("/:id", (req, res) => {
    const data = store_1.store.getData();
    const idx = data.boxes.findIndex((b) => b.id === req.params.id);
    if (idx === -1)
        return res.status(404).json({ error: "Box not found" });
    data.boxes.splice(idx, 1);
    store_1.store.save();
    res.status(204).send();
});
// Reload: move current load to history, set new load
exports.boxesRouter.post("/:id/reload", (req, res) => {
    const data = store_1.store.getData();
    const box = data.boxes.find((b) => b.id === req.params.id);
    if (!box)
        return res.status(404).json({ error: "Box not found" });
    const { newLoad, numberOfRounds, notes } = req.body;
    if (!newLoad)
        return res.status(400).json({ error: "newLoad is required" });
    // Move current load to history
    if (box.currentLoad) {
        box.loadHistory.unshift({
            ...box.currentLoad,
            date: new Date().toISOString(),
            notes: notes || undefined,
        });
    }
    box.currentLoad = {
        powderCharge: newLoad.powderCharge || "",
        powder: newLoad.powder || "",
        primer: newLoad.primer || "",
        projectile: newLoad.projectile || "",
        length: newLoad.length || "",
    };
    if (numberOfRounds !== undefined) {
        box.numberOfRounds = numberOfRounds;
    }
    box.updatedAt = new Date().toISOString();
    store_1.store.save();
    res.json(box);
});
// Assign barrel
exports.boxesRouter.post("/:id/assign-barrel", (req, res) => {
    const data = store_1.store.getData();
    const box = data.boxes.find((b) => b.id === req.params.id);
    if (!box)
        return res.status(404).json({ error: "Box not found" });
    const { barrelId } = req.body;
    const now = new Date().toISOString();
    // Unassign current barrel
    if (box.barrelId) {
        const currentEntry = box.barrelHistory.find((h) => h.barrelId === box.barrelId && !h.unassignedDate);
        if (currentEntry) {
            currentEntry.unassignedDate = now;
        }
    }
    // Assign new barrel
    if (barrelId) {
        const barrel = data.barrels.find((b) => b.id === barrelId);
        if (!barrel)
            return res.status(404).json({ error: "Barrel not found" });
        box.barrelHistory.unshift({
            barrelId: barrel.id,
            barrelName: `${barrel.caliber} ${barrel.barrelLength}`.trim(),
            assignedDate: now,
        });
    }
    box.barrelId = barrelId || null;
    box.updatedAt = now;
    store_1.store.save();
    res.json(box);
});
// Toggle status
exports.boxesRouter.patch("/:id/status", (req, res) => {
    const data = store_1.store.getData();
    const box = data.boxes.find((b) => b.id === req.params.id);
    if (!box)
        return res.status(404).json({ error: "Box not found" });
    const { status } = req.body;
    if (status !== "active" && status !== "retired") {
        return res.status(400).json({ error: "Status must be 'active' or 'retired'" });
    }
    box.status = status;
    box.updatedAt = new Date().toISOString();
    store_1.store.save();
    res.json(box);
});
