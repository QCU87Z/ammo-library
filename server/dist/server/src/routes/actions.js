"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.actionsRouter = void 0;
const express_1 = require("express");
const uuid_1 = require("uuid");
const store_1 = require("../storage/store");
exports.actionsRouter = (0, express_1.Router)();
exports.actionsRouter.get("/", (_req, res) => {
    res.json(store_1.store.getData().actions);
});
exports.actionsRouter.get("/:id", (req, res) => {
    const action = store_1.store.getData().actions.find((a) => a.id === req.params.id);
    if (!action)
        return res.status(404).json({ error: "Action not found" });
    const barrels = store_1.store.getData().barrels.filter((b) => b.actionId === action.id);
    res.json({ ...action, barrels });
});
exports.actionsRouter.post("/", (req, res) => {
    const now = new Date().toISOString();
    const action = {
        id: (0, uuid_1.v4)(),
        name: req.body.name || "",
        serialNumber: req.body.serialNumber || "",
        scopeDetails: req.body.scopeDetails || "",
        notes: req.body.notes || "",
        createdAt: now,
        updatedAt: now,
    };
    store_1.store.getData().actions.push(action);
    store_1.store.save();
    res.status(201).json(action);
});
exports.actionsRouter.put("/:id", (req, res) => {
    const data = store_1.store.getData();
    const idx = data.actions.findIndex((a) => a.id === req.params.id);
    if (idx === -1)
        return res.status(404).json({ error: "Action not found" });
    const action = data.actions[idx];
    const updatable = ["name", "serialNumber", "scopeDetails", "notes"];
    for (const key of updatable) {
        if (req.body[key] !== undefined) {
            action[key] = req.body[key];
        }
    }
    action.updatedAt = new Date().toISOString();
    store_1.store.save();
    res.json(action);
});
exports.actionsRouter.delete("/:id", (req, res) => {
    const data = store_1.store.getData();
    const attachedBarrels = data.barrels.filter((b) => b.actionId === req.params.id);
    if (attachedBarrels.length > 0) {
        return res.status(409).json({
            error: "Action has attached barrels. Remove or reassign them first.",
            barrelCount: attachedBarrels.length,
        });
    }
    const idx = data.actions.findIndex((a) => a.id === req.params.id);
    if (idx === -1)
        return res.status(404).json({ error: "Action not found" });
    data.actions.splice(idx, 1);
    store_1.store.save();
    res.status(204).send();
});
