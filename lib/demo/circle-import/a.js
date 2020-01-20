"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const b_1 = require("./b");
function a(n) {
    if (n > 0) {
        console.log("a:", n);
        b_1.b(n - 1);
    }
}
exports.a = a;
