"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const dotenv_1 = __importDefault(require("dotenv"));
const auth_routes_1 = __importDefault(require("./routes/auth.routes"));
const report_routes_1 = __importDefault(require("./routes/report.routes"));
const dashboard_routes_1 = __importDefault(require("./routes/dashboard.routes"));
const bidding_routes_1 = __importDefault(require("./routes/bidding.routes"));
const worker_routes_1 = __importDefault(require("./routes/worker.routes"));
const assistant_routes_1 = __importDefault(require("./routes/assistant.routes"));
dotenv_1.default.config();
const app = (0, express_1.default)();
const path_1 = __importDefault(require("path"));
app.use((0, cors_1.default)());
app.use(express_1.default.json());
app.use('/uploads', express_1.default.static(path_1.default.join(__dirname, '../uploads')));
const PORT = process.env.PORT || 5000;
app.get('/health', (req, res) => {
    res.json({ status: 'ok', datetime: new Date() });
});
// API Routes
app.use('/api/auth', auth_routes_1.default);
app.use('/api/reports', report_routes_1.default);
app.use('/api/dashboard', dashboard_routes_1.default);
app.use('/api/bids', bidding_routes_1.default);
app.use('/api/worker', worker_routes_1.default);
app.use('/api/assistant', assistant_routes_1.default);
app.listen(PORT, () => {
    console.log(`CivicAI Backend listening on port ${PORT}`);
});
exports.default = app;
//# sourceMappingURL=index.js.map