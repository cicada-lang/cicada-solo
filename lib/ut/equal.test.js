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
const assert_1 = __importDefault(require("assert"));
const ut = __importStar(require("./index"));
{
    let x = [1, 2, new Set([1, 2, [1, 2, 3]])];
    let y = [1, 2, new Set([1, 2, [1, 2, 3]])];
    assert_1.default(ut.equal(x, y));
}
{
    let x = new Map().set("a", "a").set("b", "b").set("c", "c");
    let y = new Map().set("c", "c").set("b", "b").set("a", "a");
    assert_1.default(ut.equal(x, y));
}
{
    let x = [1, { x: "x", y: "y" }, new Set([1, 2, [1, 2, { x: "x", y: "y" }]])];
    let y = [1, { x: "x", y: "y" }, new Set([1, 2, [1, 2, { x: "x", y: "y" }]])];
    assert_1.default(ut.equal(x, y));
}
{
    function f(x) {
        return `x: ${x}`;
    }
    let x = [f, { x: "x", y: "y" }, new Set([1, 2, [1, 2, { x: "x", y: "y" }]])];
    let y = [f, { x: "x", y: "y" }, new Set([1, 2, [1, 2, { x: "x", y: "y" }]])];
    assert_1.default(ut.equal(x, y));
}
{
    function f(x) {
        return (y) => `x: ${x}, y: ${y}`;
    }
    let x = f(1);
    let y = f(1);
    assert_1.default(!ut.equal(x, y));
}
