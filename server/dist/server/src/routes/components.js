"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.componentsRouter = void 0;
const express_1 = require("express");
const store_1 = require("../storage/store");
exports.componentsRouter = (0, express_1.Router)();
const VALID_TYPES = ["powders", "primers", "projectiles"];
function isValidType(type) {
    return VALID_TYPES.includes(type);
}
exports.componentsRouter.get("/", (_req, res) => {
    res.json(store_1.store.getData().components);
});
exports.componentsRouter.post("/:type", (req, res) => {
    const { type } = req.params;
    if (!isValidType(type))
        return res.status(400).json({ error: "Invalid component type" });
    const { name } = req.body;
    if (!name || typeof name !== "string")
        return res.status(400).json({ error: "Name required" });
    const list = store_1.store.getData().components[type];
    if (list.includes(name))
        return res.status(409).json({ error: "Already exists" });
    list.push(name);
    list.sort();
    store_1.store.save();
    res.status(201).json(store_1.store.getData().components);
});
exports.componentsRouter.put("/:type/:index", (req, res) => {
    const { type, index: indexStr } = req.params;
    if (!isValidType(type))
        return res.status(400).json({ error: "Invalid component type" });
    const index = parseInt(indexStr, 10);
    const list = store_1.store.getData().components[type];
    if (index < 0 || index >= list.length)
        return res.status(404).json({ error: "Index out of range" });
    const { name } = req.body;
    if (!name || typeof name !== "string")
        return res.status(400).json({ error: "Name required" });
    list[index] = name;
    store_1.store.save();
    res.json(store_1.store.getData().components);
});
exports.componentsRouter.delete("/:type/:index", (req, res) => {
    const { type, index: indexStr } = req.params;
    if (!isValidType(type))
        return res.status(400).json({ error: "Invalid component type" });
    const index = parseInt(indexStr, 10);
    const list = store_1.store.getData().components[type];
    if (index < 0 || index >= list.length)
        return res.status(404).json({ error: "Index out of range" });
    list.splice(index, 1);
    store_1.store.save();
    res.json(store_1.store.getData().components);
});
