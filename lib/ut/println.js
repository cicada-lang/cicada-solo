"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.println = void 0;
const util_1 = __importDefault(require("util"));
function println(x) {
    console.log(util_1.default.inspect(x, false, null, true));
}
exports.println = println;
