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
exports.to_env = void 0;
const Env = __importStar(require("../env"));
const Value = __importStar(require("../value"));
const Neutral = __importStar(require("../neutral"));
function to_env(ctx) {
    const env = Env.init();
    for (const [name, { t, value }] of ctx) {
        if (value !== undefined) {
            Env.extend(env, name, value);
        }
        else {
            Env.extend(env, name, Value.reflection(t, Neutral.v(name)));
        }
    }
    return env;
}
exports.to_env = to_env;
