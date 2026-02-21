"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.barrelsRouter = void 0;
const express_1 = require("express");
const uuid_1 = require("uuid");
const store_1 = require("../storage/store");
exports.barrelsRouter = (0, express_1.Router)();
function computeRoundCount(barrelId, boxes) {
    let total = 0;
    for (const box of boxes) {
        const periods = box.barrelHistory.filter((h) => h.barrelId === barrelId);
        for (const period of periods) {
            const periodStart = new Date(period.assignedDate).getTime();
            const periodEnd = period.unassignedDate
                ? new Date(period.unassignedDate).getTime()
                : Date.now();
            const loadsInPeriod = box.loadHistory.filter((l) => {
                const t = new Date(l.date).getTime();
                return t >= periodStart && t <= periodEnd;
            }).length;
            let sessions = loadsInPeriod;
            if (!period.unassignedDate && box.currentLoad !== null) {
                sessions += 1;
            }
            total += sessions * box.numberOfRounds;
        }
    }
    return total;
}
exports.barrelsRouter.get("/", (req, res) => {
    let barrels = store_1.store.getData().barrels;
    const boxes = store_1.store.getData().boxes;
    const { actionId } = req.query;
    if (actionId && typeof actionId === "string") {
        barrels = barrels.filter((b) => b.actionId === actionId);
    }
    res.json(barrels.map((b) => ({ ...b, roundCount: computeRoundCount(b.id, boxes) })));
});
exports.barrelsRouter.get("/:id", (req, res) => {
    const barrel = store_1.store.getData().barrels.find((b) => b.id === req.params.id);
    if (!barrel)
        return res.status(404).json({ error: "Barrel not found" });
    const boxes = store_1.store.getData().boxes;
    const assignedBoxes = boxes.filter((b) => b.barrelId === barrel.id);
    res.json({ ...barrel, boxes: assignedBoxes, roundCount: computeRoundCount(barrel.id, boxes) });
});
exports.barrelsRouter.post("/", (req, res) => {
    const now = new Date().toISOString();
    // Validate actionId if provided
    if (req.body.actionId) {
        const action = store_1.store.getData().actions.find((a) => a.id === req.body.actionId);
        if (!action)
            return res.status(404).json({ error: "Action not found" });
    }
    const barrel = {
        id: (0, uuid_1.v4)(),
        actionId: req.body.actionId || null,
        serialNumber: req.body.serialNumber || "",
        caliber: req.body.caliber || "",
        barrelLength: req.body.barrelLength || "",
        twistRate: req.body.twistRate || "",
        zeroDistance: req.body.zeroDistance || "",
        notes: req.body.notes || "",
        createdAt: now,
        updatedAt: now,
    };
    store_1.store.getData().barrels.push(barrel);
    store_1.store.save();
    res.status(201).json(barrel);
});
exports.barrelsRouter.put("/:id", (req, res) => {
    const data = store_1.store.getData();
    const idx = data.barrels.findIndex((b) => b.id === req.params.id);
    if (idx === -1)
        return res.status(404).json({ error: "Barrel not found" });
    // Validate actionId if provided
    if (req.body.actionId) {
        const action = data.actions.find((a) => a.id === req.body.actionId);
        if (!action)
            return res.status(404).json({ error: "Action not found" });
    }
    const barrel = data.barrels[idx];
    const updatable = ["actionId", "serialNumber", "caliber", "barrelLength", "twistRate", "zeroDistance", "notes"];
    for (const key of updatable) {
        if (req.body[key] !== undefined) {
            barrel[key] = req.body[key];
        }
    }
    barrel.updatedAt = new Date().toISOString();
    store_1.store.save();
    res.json(barrel);
});
exports.barrelsRouter.delete("/:id", (req, res) => {
    const data = store_1.store.getData();
    const assignedBoxes = data.boxes.filter((b) => b.barrelId === req.params.id);
    if (assignedBoxes.length > 0) {
        return res.status(409).json({
            error: "Barrel has assigned boxes. Remove or reassign them first.",
            boxCount: assignedBoxes.length,
        });
    }
    const idx = data.barrels.findIndex((b) => b.id === req.params.id);
    if (idx === -1)
        return res.status(404).json({ error: "Barrel not found" });
    data.barrels.splice(idx, 1);
    store_1.store.save();
    res.status(204).send();
});
