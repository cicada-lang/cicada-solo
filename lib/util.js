"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const nanoid_1 = __importDefault(require("nanoid"));
function unique_name(base) {
    let uuid = nanoid_1.default();
    return `${base}#${uuid}`;
}
exports.unique_name = unique_name;
