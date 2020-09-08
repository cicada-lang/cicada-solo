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
const Exp = __importStar(require("../exp"));
const Normal = __importStar(require("../normal"));
const Neutral = __importStar(require("../neutral"));
function readback(used, neutral) {
    switch (neutral.kind) {
        case "Neutral.v": {
            return Exp.v(neutral.name);
        }
        case "Neutral.ap": {
            return Exp.ap(Neutral.readback(used, neutral.target), Normal.readback(used, neutral.arg));
        }
        case "Neutral.rec": {
            return Exp.rec(neutral.ret_t, Neutral.readback(used, neutral.target), Normal.readback(used, neutral.base), Normal.readback(used, neutral.step));
        }
    }
}
exports.readback = readback;
