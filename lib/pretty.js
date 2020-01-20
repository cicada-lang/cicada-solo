(function (factory) {
    if (typeof module === "object" && typeof module.exports === "object") {
        var v = factory(require, exports);
        if (v !== undefined) module.exports = v;
    }
    else if (typeof define === "function" && define.amd) {
        define(["require", "exports"], factory);
    }
})(function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    function pretty_exp(exp) {
        throw new Error("TODO");
    }
    exports.pretty_exp = pretty_exp;
    function pretty_value(value) {
        throw new Error("TODO");
    }
    exports.pretty_value = pretty_value;
});
