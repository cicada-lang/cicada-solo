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
        constructor(named_entries = []) {
            this.named_entries = named_entries;
        }
    }
    exports.Scope = Scope;
    var Entry;
    (function (Entry_1) {
        class Entry {
        }
        Entry_1.Entry = Entry;
        class Let extends Entry {
            constructor(value) {
                super();
                this.value = value;
            }
        }
        Entry_1.Let = Let;
        class Given extends Entry {
            constructor(t) {
                super();
                this.t = t;
            }
        }
        Entry_1.Given = Given;
        class Define extends Entry {
            constructor(t, value) {
                super();
                this.t = t;
                this.value = value;
            }
        }
        Entry_1.Define = Define;
    })(Entry = exports.Entry || (exports.Entry = {}));
});
