"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const bidding_controller_1 = require("../controllers/bidding.controller");
const auth_middleware_1 = require("../middleware/auth.middleware");
const router = express_1.default.Router();
// Fetch open bids (could be public or contractor only, keeping public for visibility)
router.get('/available', bidding_controller_1.getAvailableBids);
// Contractor actions require auth
router.post('/submit', auth_middleware_1.authenticate, bidding_controller_1.submitBid);
// Authority actions require auth (ideally role check middleware here)
router.post('/accept', auth_middleware_1.authenticate, bidding_controller_1.acceptBid);
exports.default = router;
//# sourceMappingURL=bidding.routes.js.map