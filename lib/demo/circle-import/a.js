(function (factory) {
    if (typeof module === "object" && typeof module.exports === "object") {
        var v = factory(require, exports);
        if (v !== undefined) module.exports = v;
    }
    else if (typeof define === "function" && define.amd) {
        define(["require", "exports", "./b"], factory);
    }
})(function (require, exports) {
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
});
