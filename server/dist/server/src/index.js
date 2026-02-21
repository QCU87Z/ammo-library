"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const path_1 = __importDefault(require("path"));
const boxes_1 = require("./routes/boxes");
const actions_1 = require("./routes/actions");
const barrels_1 = require("./routes/barrels");
const components_1 = require("./routes/components");
const loads_1 = require("./routes/loads");
const cartridges_1 = require("./routes/cartridges");
const elevations_1 = require("./routes/elevations");
const app = (0, express_1.default)();
const PORT = process.env.PORT || 3001;
app.use((0, cors_1.default)());
app.use(express_1.default.json());
// API routes
app.use("/api/boxes", boxes_1.boxesRouter);
app.use("/api/actions", actions_1.actionsRouter);
app.use("/api/barrels", barrels_1.barrelsRouter);
app.use("/api/components", components_1.componentsRouter);
app.use("/api/loads", loads_1.loadsRouter);
app.use("/api/cartridges", cartridges_1.cartridgesRouter);
app.use("/api/elevations", elevations_1.elevationsRouter);
// Serve static files from client build
const clientDist = process.env.CLIENT_DIST || path_1.default.resolve(__dirname, "../../client/dist");
app.use(express_1.default.static(clientDist));
// SPA fallback
app.get("*", (_req, res) => {
    res.sendFile(path_1.default.join(clientDist, "index.html"));
});
app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});
