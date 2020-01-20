"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const a_1 = require("./a");
function b(n) {
    if (n > 0) {
        console.log("b:", n);
        a_1.a(n - 1);
    }
}
exports.b = b;
