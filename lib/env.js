"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const error_1 = require("./error");
const evaluate_1 = require("./evaluate");
class Env {
    constructor(entry_map = new Map()) {
        this.entry_map = entry_map;
    }
    lookup_type_and_value(name) {
        let entry = this.entry_map.get(name);
        if (entry === undefined) {
            return undefined;
        }
        else if (entry instanceof Entry.DefineRec) {
            let { t, value, env } = entry;
            return {
                t: evaluate_1.evaluate(env.ext_rec(name, { t, value, env }), t),
                value: evaluate_1.evaluate(env.ext_rec(name, { t, value, env }), value),
            };
        }
        else if (entry instanceof Entry.Define) {
            let { t, value } = entry;
            return { t, value };
        }
        else {
            throw new error_1.ErrorReport([
                "Env.lookup_type_and_value fail\n" +
                    `unhandled class of Entry: ${entry.constructor.name}\n`
            ]);
        }
    }
    lookup_type(name) {
        let result = this.lookup_type_and_value(name);
        if (result === undefined) {
            return undefined;
        }
        else {
            let { t } = result;
            return t;
        }
    }
    lookup_value(name) {
        let result = this.lookup_type_and_value(name);
        if (result === undefined) {
            return undefined;
        }
        else {
            let { value } = result;
            return value;
        }
    }
    ext(name, the) {
        return new Env(new Map([
            ...this.entry_map,
            [name, new Entry.Define(the.t, the.value)],
        ]));
    }
    ext_rec(name, the) {
        return new Env(new Map([
            ...this.entry_map,
            [name, new Entry.DefineRec(the.t, the.value, the.env)],
        ]));
    }
}
exports.Env = Env;
var Entry;
(function (Entry_1) {
    class Entry {
    }
    Entry_1.Entry = Entry;
    class DefineRec extends Entry {
        constructor(t, value, env) {
            super();
            this.t = t;
            this.value = value;
            this.env = env;
        }
    }
    Entry_1.DefineRec = DefineRec;
    class Define extends Entry {
        constructor(t, value) {
            super();
            this.t = t;
            this.value = value;
        }
    }
    Entry_1.Define = Define;
})(Entry = exports.Entry || (exports.Entry = {}));
