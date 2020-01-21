(function (factory) {
    if (typeof module === "object" && typeof module.exports === "object") {
        var v = factory(require, exports);
        if (v !== undefined) module.exports = v;
    }
    else if (typeof define === "function" && define.amd) {
        define(["require", "exports", "./evaluate", "./infer"], factory);
    }
})(function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    const evaluate_1 = require("./evaluate");
    const infer_1 = require("./infer");
    class Scope {
        constructor(named_entries = []) {
            this.named_entries = named_entries;
        }
        get arity() {
            let n = 0;
            for (let [_name, entry] of this.named_entries) {
                if (entry instanceof Entry.Given) {
                    n += 1;
                }
            }
            return n;
        }
        lookup_value(name) {
            let named_entry = this.named_entries.find(([entry_name, _entry]) => name === entry_name);
            if (named_entry === undefined) {
                return undefined;
            }
            let [_name, entry] = named_entry;
            if (entry instanceof Entry.Let) {
                let { value } = entry;
                return value;
            }
            else if (entry instanceof Entry.Given) {
                return undefined;
            }
            else if (entry instanceof Entry.Define) {
                let { value } = entry;
                return value;
            }
            else {
                throw new Error("Scope.lookup_value fail\n" +
                    `unhandled class of Scope.Entry: ${entry.constructor.name}\n`);
            }
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
    function entry_to_type(env, entry) {
        if (entry instanceof Entry.Let) {
            let { value } = entry;
            return infer_1.infer(env, value);
        }
        else if (entry instanceof Entry.Given) {
            let { t } = entry;
            return evaluate_1.evaluate(env, t);
        }
        else if (entry instanceof Entry.Define) {
            let { t } = entry;
            return evaluate_1.evaluate(env, t);
        }
        else {
            throw new Error("entry_to_type fail\n" +
                `unhandled class of Scope.Entry: ${entry.constructor.name}\n`);
        }
    }
    exports.entry_to_type = entry_to_type;
});
