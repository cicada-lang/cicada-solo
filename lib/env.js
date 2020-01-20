(function (factory) {
    if (typeof module === "object" && typeof module.exports === "object") {
        var v = factory(require, exports);
        if (v !== undefined) module.exports = v;
    }
    else if (typeof define === "function" && define.amd) {
        define(["require", "exports", "./evaluate"], factory);
    }
})(function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    const evaluate_1 = require("./evaluate");
    class Env {
        constructor(entry_map = new Map()) {
            this.entry_map = entry_map;
        }
        lookup_type_and_value(name) {
            let entry = this.entry_map.get(name);
            if (entry !== undefined) {
                if (entry instanceof EnvEntryRecursiveDefine) {
                    let { t, value, env } = entry;
                    return {
                        t: evaluate_1.evaluate(env.ext_recursive(name, t, value, env), t),
                        value: evaluate_1.evaluate(env.ext_recursive(name, t, value, env), value),
                    };
                }
                else if (entry instanceof EnvEntryDefine) {
                    let { t, value } = entry;
                    return { t, value };
                }
                else {
                    throw new Error("Env.lookup_type_and_value fail" +
                        `unhandled class of EnvEntry: ${entry.constructor.name}`);
                }
            }
            else {
                return undefined;
            }
        }
        lookup_type(name) {
            let result = this.lookup_type_and_value(name);
            if (result !== undefined) {
                let { t } = result;
                return t;
            }
            else {
                return undefined;
            }
        }
        lookup_value(name) {
            let result = this.lookup_type_and_value(name);
            if (result !== undefined) {
                let { value } = result;
                return value;
            }
            else {
                return undefined;
            }
        }
        ext(name, t, value) {
            return new Env(new Map([
                ...this.entry_map,
                [name, new EnvEntryDefine(t, value)],
            ]));
        }
        ext_recursive(name, t, value, env) {
            return new Env(new Map([
                ...this.entry_map,
                [name, new EnvEntryRecursiveDefine(t, value, env)],
            ]));
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
