"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const evaluate_1 = require("./evaluate");
function check(n) {
    if (n > 0) {
        console.log("check:", n);
        evaluate_1.evaluate(n - 1);
    }
}
exports.check = check;
