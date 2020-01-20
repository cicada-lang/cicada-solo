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
    class Env {
        constructor(entry_map) {
            this.entry_map = entry_map;
        }
    }
    exports.Env = Env;
    class EnvEntry {
    }
    exports.EnvEntry = EnvEntry;
    class EnvEntryRecursiveDefine extends EnvEntry {
        constructor(t, value, env) {
            super();
            this.t = t;
            this.value = value;
            this.env = env;
        }
    }
    exports.EnvEntryRecursiveDefine = EnvEntryRecursiveDefine;
    class EnvEntryDefine extends EnvEntry {
        constructor(t, value) {
            super();
            this.t = t;
            this.value = value;
        }
    }
    exports.EnvEntryDefine = EnvEntryDefine;
});
