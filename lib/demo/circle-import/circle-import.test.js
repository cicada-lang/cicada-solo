(function (factory) {
    if (typeof module === "object" && typeof module.exports === "object") {
        var v = factory(require, exports);
        if (v !== undefined) module.exports = v;
    }
    else if (typeof define === "function" && define.amd) {
        define(["require", "exports", "./a", "./b"], factory);
    }
})(function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    const a_1 = require("./a");
    const b_1 = require("./b");
    {
        console.log("[demo] circle import");
        console.log("a(6)");
        a_1.a(6);
        console.log("b(6)");
        b_1.b(6);
    }
});
