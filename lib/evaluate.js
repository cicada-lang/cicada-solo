"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const check_1 = require("./check");
function evaluate(n) {
    if (n > 0) {
        console.log("evaluate:", n);
        check_1.check(n - 1);
    }
}
exports.evaluate = evaluate;
