var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) result[k] = mod[k];
    result["default"] = mod;
    return result;
};
(function (factory) {
    if (typeof module === "object" && typeof module.exports === "object") {
        var v = factory(require, exports);
        if (v !== undefined) module.exports = v;
    }
    else if (typeof define === "function" && define.amd) {
        define(["require", "exports", "./pretty"], factory);
    }
})(function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    const pretty = __importStar(require("./pretty"));
    function equivalent(s, t) {
        try {
        }
        catch (error) {
            throw error.prepend("equivalent fail\n" +
                `s: ${pretty.pretty_value(s)}\n` +
                `t: ${pretty.pretty_value(t)}\n`);
        }
    }
    exports.equivalent = equivalent;
});
