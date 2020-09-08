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
exports.normalize = void 0;
const Value = __importStar(require("../value"));
const Exp = __importStar(require("../exp"));
const Env = __importStar(require("../env"));
const Ctx = __importStar(require("../ctx"));
function normalize(exp) {
    const env = Env.init();
    const value = Exp.evaluate(env, exp);
    const ctx = Ctx.init();
    const t = Exp.infer(ctx, exp);
    return Value.readback(new Set(), t, value);
}
exports.normalize = normalize;
