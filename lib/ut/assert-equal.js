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
exports.assert_equal = void 0;
const ut = __importStar(require("./index"));
const deep_diff = __importStar(require("deep-diff"));
function assert_equal(x, y) {
    if (!ut.equal(x, y)) {
        throw Error("assert_equal fail\n" +
            "the following two values are not equal\n" +
            `x: ${ut.inspect(x)}\n` +
            `y: ${ut.inspect(y)}\n` +
            `diff: ${ut.inspect(deep_diff.diff(x, y))}\n`);
    }
}
exports.assert_equal = assert_equal;
