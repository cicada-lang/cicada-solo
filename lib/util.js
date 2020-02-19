"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
// import nanoid from "nanoid"
const generate_1 = __importDefault(require("nanoid/generate"));
function unique_name(base) {
    // let uuid: string = nanoid()
    let uuid = generate_1.default("123456789", 5);
    return `${base}#${uuid}`;
}
exports.unique_name = unique_name;
