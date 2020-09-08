"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.to_number = void 0;
function to_number(numeral) {
    return numeral((n) => n + 1)(0);
}
exports.to_number = to_number;
