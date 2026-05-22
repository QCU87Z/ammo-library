import { Router } from "express";
import { store } from "../storage/store";
import { computeRoundCount } from "./barrels";
import { Load } from "../../../shared/types";

export const riflesRouter = Router();

function loadKey(load: Load): string {
  return [load.powder, load.powderCharge, load.primer, load.projectile, load.length].join("|");
}

riflesRouter.get("/", (_req, res) => {
  const { barrels, actions, boxes } = store.getData();
  const actionMap = new Map(actions.map((a) => [a.id, a]));

  const summaries = barrels.map((barrel) => {
    const assignedBoxes = boxes.filter((b) => b.barrelId === barrel.id);
    const lastUpdatedAt = assignedBoxes.reduce(
      (acc, b) => (b.updatedAt > acc ? b.updatedAt : acc),
      barrel.updatedAt
    );
    return {
      barrel,
      action: barrel.actionId ? actionMap.get(barrel.actionId) ?? null : null,
      roundCount: computeRoundCount(barrel.id, boxes),
      activeBoxCount: assignedBoxes.filter((b) => b.status === "active").length,
      lastUpdatedAt,
    };
  });

  res.json(summaries);
});

riflesRouter.get("/:barrelId", (req, res) => {
  const { barrels, actions, boxes, loads, elevations } = store.getData();
  const barrel = barrels.find((b) => b.id === req.params.barrelId);
  if (!barrel) return res.status(404).json({ error: "Rifle not found" });

  const action = barrel.actionId ? actions.find((a) => a.id === barrel.actionId) ?? null : null;
  const assignedBoxes = boxes.filter((b) => b.barrelId === barrel.id);

  const matchingLoads = loads.filter(
    (l) => l.caliber && barrel.caliber && l.caliber.toLowerCase() === barrel.caliber.toLowerCase()
  );

  const rotationMap = new Map<string, { load: Load; boxCount: number; roundCount: number }>();
  for (const box of assignedBoxes) {
    if (!box.currentLoad) continue;
    const key = loadKey(box.currentLoad);
    const existing = rotationMap.get(key);
    if (existing) {
      existing.boxCount++;
      existing.roundCount += box.numberOfRounds;
    } else {
      rotationMap.set(key, {
        load: box.currentLoad,
        boxCount: 1,
        roundCount: box.numberOfRounds,
      });
    }
  }
  const loadsInRotation = Array.from(rotationMap.values()).sort(
    (a, b) => b.roundCount - a.roundCount
  );

  const barrelElevations = elevations
    .filter((e) => e.barrelId === barrel.id)
    .sort((a, b) => a.distanceM - b.distanceM || b.recordedAt.localeCompare(a.recordedAt));

  res.json({
    barrel,
    action,
    roundCount: computeRoundCount(barrel.id, boxes),
    boxes: assignedBoxes,
    matchingLoads,
    loadsInRotation,
    elevations: barrelElevations,
  });
});
