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
                    return [evaluate_1.evaluate(env.ext_recursive(name, t, value, env), t),
                        evaluate_1.evaluate(env.ext_recursive(name, t, value, env), value)];
                    throw new Error("TODO");
                }
                else if (entry instanceof EnvEntryDefine) {
                    return [entry.t, entry.value];
                }
                else {
                    throw new Error("TODO");
                }
            }
            else {
                return undefined;
            }
        }
        //   def lookup_type(name: string): Option[Value] {
        //     lookup_type_and_value(name).map {
        //       case (t, _value) => t
        //     }
        //   }
        //   def lookup_value(name: string): Option[Value] {
        //     lookup_type_and_value(name).map {
        //       case (_t, value) => value
        //     }
        //   }
        //   def ext(name: string, t: Value, value: Value): Env {
        //     Env(this.entry_map + (name -> EnvEntryDefine(t, value)))
        //   }
        ext_recursive(name, t, value, env) {
            throw new Error("TODO");
            // return new Env(this.entry_map + (name -> EnvEntryRecursiveDefine(t, value, env)))
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
