(function (factory) {
    if (typeof module === "object" && typeof module.exports === "object") {
        var v = factory(require, exports);
        if (v !== undefined) module.exports = v;
    }
    else if (typeof define === "function" && define.amd) {
        define(["require", "exports", "./check"], factory);
    }
})(function (require, exports) {
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
});
