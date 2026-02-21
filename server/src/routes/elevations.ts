import { Router } from "express";
import { v4 as uuidv4 } from "uuid";
import { store } from "../storage/store";
import { Elevation } from "../../../shared/types";

export const elevationsRouter = Router();

elevationsRouter.get("/", (req, res) => {
  let elevations = store.getData().elevations;
  const { barrelId, loadId } = req.query;
  if (barrelId && typeof barrelId === "string") {
    elevations = elevations.filter((e) => e.barrelId === barrelId);
  }
  if (loadId && typeof loadId === "string") {
    elevations = elevations.filter((e) => e.loadId === loadId);
  }
  // Sort by distanceM asc, then recordedAt desc
  elevations = [...elevations].sort((a, b) => {
    if (a.distanceM !== b.distanceM) return a.distanceM - b.distanceM;
    return new Date(b.recordedAt).getTime() - new Date(a.recordedAt).getTime();
  });
  res.json(elevations);
});

elevationsRouter.get("/:id", (req, res) => {
  const elevation = store.getData().elevations.find((e) => e.id === req.params.id);
  if (!elevation) return res.status(404).json({ error: "Elevation not found" });
  res.json(elevation);
});

elevationsRouter.post("/", (req, res) => {
  const data = store.getData();

  // Validate barrelId
  const barrel = data.barrels.find((b) => b.id === req.body.barrelId);
  if (!barrel) return res.status(404).json({ error: "Barrel not found" });

  // Validate loadId
  const load = data.loads.find((l) => l.id === req.body.loadId);
  if (!load) return res.status(404).json({ error: "Load not found" });

  const now = new Date().toISOString();
  const elevation: Elevation = {
    id: uuidv4(),
    barrelId: req.body.barrelId,
    loadId: req.body.loadId,
    distanceM: Number(req.body.distanceM),
    moa: Number(req.body.moa),
    recordedAt: req.body.recordedAt || now,
    createdAt: now,
    updatedAt: now,
  };
  data.elevations.push(elevation);
  store.save();
  res.status(201).json(elevation);
});

elevationsRouter.put("/:id", (req, res) => {
  const data = store.getData();
  const idx = data.elevations.findIndex((e) => e.id === req.params.id);
  if (idx === -1) return res.status(404).json({ error: "Elevation not found" });

  // Validate barrelId if provided
  if (req.body.barrelId !== undefined) {
    const barrel = data.barrels.find((b) => b.id === req.body.barrelId);
    if (!barrel) return res.status(404).json({ error: "Barrel not found" });
  }

  // Validate loadId if provided
  if (req.body.loadId !== undefined) {
    const load = data.loads.find((l) => l.id === req.body.loadId);
    if (!load) return res.status(404).json({ error: "Load not found" });
  }

  const elevation = data.elevations[idx];
  if (req.body.barrelId !== undefined) elevation.barrelId = req.body.barrelId;
  if (req.body.loadId !== undefined) elevation.loadId = req.body.loadId;
  if (req.body.distanceM !== undefined) elevation.distanceM = Number(req.body.distanceM);
  if (req.body.moa !== undefined) elevation.moa = Number(req.body.moa);
  if (req.body.recordedAt !== undefined) elevation.recordedAt = req.body.recordedAt;
  elevation.updatedAt = new Date().toISOString();
  store.save();
  res.json(elevation);
});

elevationsRouter.delete("/:id", (req, res) => {
  const data = store.getData();
  const idx = data.elevations.findIndex((e) => e.id === req.params.id);
  if (idx === -1) return res.status(404).json({ error: "Elevation not found" });
  data.elevations.splice(idx, 1);
  store.save();
  res.status(204).send();
});
