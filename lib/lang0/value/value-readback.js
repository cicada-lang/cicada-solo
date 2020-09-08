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
const freshen_1 = require("./freshen");
const Neutral = __importStar(require("../neutral"));
const Value = __importStar(require("../value"));
const Exp = __importStar(require("../exp"));
function readback(used, value) {
    switch (value.kind) {
        case "Value.reflection": {
            return Neutral.readback(used, value.neutral);
        }
        case "Value.fn": {
            const name = freshen_1.freshen(used, value.name);
            const v = Value.reflection(Neutral.v(name));
            const ret = Exp.do_ap(value, v);
            return Exp.fn(name, readback(new Set([...used, name]), ret));
        }
    }
}
exports.readback = readback;
