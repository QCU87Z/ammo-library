"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const path_1 = __importDefault(require("path"));
const boxes_1 = require("./routes/boxes");
const rifles_1 = require("./routes/rifles");
const components_1 = require("./routes/components");
const app = (0, express_1.default)();
const PORT = process.env.PORT || 3001;
app.use((0, cors_1.default)());
app.use(express_1.default.json());
// API routes
app.use("/api/boxes", boxes_1.boxesRouter);
app.use("/api/rifles", rifles_1.riflesRouter);
app.use("/api/components", components_1.componentsRouter);
// Serve static files from client build
const clientDist = path_1.default.resolve(__dirname, "../../client/dist");
app.use(express_1.default.static(clientDist));
// SPA fallback
app.get("*", (_req, res) => {
    res.sendFile(path_1.default.join(clientDist, "index.html"));
});
app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});
