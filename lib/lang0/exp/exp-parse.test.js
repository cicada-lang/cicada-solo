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
const Exp = __importStar(require("../exp"));
const ut = __importStar(require("../../ut"));
const sentences = [
    "x",
    "f(x)",
    "(x) => f(x)",
    "(f) => (x) => x",
    "(f) => (x) => f(x)",
    "(f) => (x) => f(f(x))",
    "(f) => (x) => f(f(f(x)))",
    "(f) => (x) => f(f(f(f(x))))",
    "(f) => (x) => f(x)(x)(x)",
    `(f) => (x) => {
  y = x
  f(y)
}`,
];
for (const sentence of sentences) {
    const exp = Exp.parse(sentence);
    const repr = Exp.repr(exp);
    ut.assert_equal(sentence, repr);
}
