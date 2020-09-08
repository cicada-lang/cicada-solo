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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.run = void 0;
const Exp = __importStar(require("../exp"));
const Ty = __importStar(require("../ty"));
const Ctx = __importStar(require("../ctx"));
const Env = __importStar(require("../env"));
const Trace = __importStar(require("../../trace"));
const fs_1 = __importDefault(require("fs"));
function run(file, opts) {
    const text = fs_1.default.readFileSync(file, { encoding: "utf-8" });
    const exp = Exp.parse(text);
    try {
        const ctx = Ctx.init();
        const t = Exp.infer(ctx, exp);
        const env = Env.init();
        console.log(`${Exp.repr(Exp.normalize(exp))}: ${Ty.repr(t)}`);
    }
    catch (error) {
        Trace.maybe_report(error, Exp.repr);
    }
}
exports.run = run;
