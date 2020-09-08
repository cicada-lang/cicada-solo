"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.readback = void 0;
const Neutral = __importStar(require("../neutral"));
const Normal = __importStar(require("../normal"));
const Exp = __importStar(require("../exp"));
function readback(ctx, neutral) {
    switch (neutral.kind) {
        case "Neutral.v": {
            return Exp.v(neutral.name);
        }
        case "Neutral.ap": {
            return Exp.ap(Neutral.readback(ctx, neutral.target), Normal.readback(ctx, neutral.arg));
        }
        case "Neutral.car": {
            return Exp.car(Neutral.readback(ctx, neutral.target));
        }
        case "Neutral.cdr": {
            return Exp.cdr(Neutral.readback(ctx, neutral.target));
        }
        case "Neutral.nat_ind": {
            return Exp.nat_ind(Neutral.readback(ctx, neutral.target), Normal.readback(ctx, neutral.motive), Normal.readback(ctx, neutral.base), Normal.readback(ctx, neutral.step));
        }
        case "Neutral.replace": {
            return Exp.replace(Neutral.readback(ctx, neutral.target), Normal.readback(ctx, neutral.motive), Normal.readback(ctx, neutral.base));
        }
        case "Neutral.absurd_ind": {
            return Exp.absurd_ind(Neutral.readback(ctx, neutral.target), Normal.readback(ctx, neutral.motive));
        }
    }
}
exports.readback = readback;
