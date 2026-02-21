import express from "express";
import cors from "cors";
import path from "path";
import { boxesRouter } from "./routes/boxes";
import { actionsRouter } from "./routes/actions";
import { barrelsRouter } from "./routes/barrels";
import { componentsRouter } from "./routes/components";
import { loadsRouter } from "./routes/loads";
import { cartridgesRouter } from "./routes/cartridges";
import { elevationsRouter } from "./routes/elevations";

const app = express();
const PORT = process.env.PORT || 3001;

app.use(cors());
app.use(express.json());

// API routes
app.use("/api/boxes", boxesRouter);
app.use("/api/actions", actionsRouter);
app.use("/api/barrels", barrelsRouter);
app.use("/api/components", componentsRouter);
app.use("/api/loads", loadsRouter);
app.use("/api/cartridges", cartridgesRouter);
app.use("/api/elevations", elevationsRouter);

// Serve static files from client build
const clientDist = process.env.CLIENT_DIST || path.resolve(__dirname, "../../client/dist");
app.use(express.static(clientDist));

// SPA fallback
app.get("*", (_req, res) => {
  res.sendFile(path.join(clientDist, "index.html"));
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
