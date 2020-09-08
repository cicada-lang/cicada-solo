"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.aline = void 0;
function aline(text) {
    return (text
        .split("\n")
        .map((s) => s.trimStart())
        // NOTE ignore non | lines
        .filter((s) => s.startsWith("|"))
        .map((s) => s.slice(1))
        .map((s) => s + "\n")
        .join(""));
}
exports.aline = aline;
