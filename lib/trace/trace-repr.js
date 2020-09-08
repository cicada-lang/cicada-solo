"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.repr = void 0;
function repr(trace, formater) {
    let s = "";
    s += trace.message;
    s += `previous:\n`;
    for (const x of trace.previous) {
        s += `- ${formater(x)}\n`;
    }
    return s;
}
exports.repr = repr;
