"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.freshen = void 0;
function freshen(used, name) {
    let counter = 1;
    const base = name;
    while (used.has(name)) {
        name = `${base}_${counter}`;
    }
    return name;
}
exports.freshen = freshen;
