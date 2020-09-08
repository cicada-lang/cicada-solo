"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.from_number = void 0;
function from_number(n) {
    if (n <= 0) {
        return (f) => (x) => x;
    }
    else {
        const almost = from_number(n - 1);
        return (f) => (x) => almost(f)(f(x));
    }
}
exports.from_number = from_number;
