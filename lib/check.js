(function (factory) {
    if (typeof module === "object" && typeof module.exports === "object") {
        var v = factory(require, exports);
        if (v !== undefined) module.exports = v;
    }
    else if (typeof define === "function" && define.amd) {
        define(["require", "exports", "./evaluate"], factory);
    }
})(function (require, exports) {
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
});
