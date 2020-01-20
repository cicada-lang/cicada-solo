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
    class Scope {
        constructor(named_entry_list) {
            this.named_entry_list = named_entry_list;
        }
        get length() {
            return this.named_entry_list.length;
        }
    }
    exports.Scope = Scope;
    class ScopeEntry {
    }
    exports.ScopeEntry = ScopeEntry;
    class ScopeLet extends ScopeEntry {
        constructor(value) {
            super();
            this.value = value;
        }
    }
    exports.ScopeLet = ScopeLet;
    class ScopeGiven extends ScopeEntry {
        constructor(t) {
            super();
            this.t = t;
        }
    }
    exports.ScopeGiven = ScopeGiven;
    class ScopeDefine extends ScopeEntry {
        constructor(t, value) {
            super();
            this.t = t;
            this.value = value;
        }
    }
    exports.ScopeDefine = ScopeDefine;
});
