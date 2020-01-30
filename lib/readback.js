"use strict";
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) result[k] = mod[k];
    result["default"] = mod;
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
const Exp = __importStar(require("./exp"));
const Value = __importStar(require("./value"));
const Scope = __importStar(require("./scope"));
const Err = __importStar(require("./err"));
const evaluate_1 = require("./evaluate");
const infer_1 = require("./infer");
function readback(value) {
    if (value instanceof Value.Type) {
        return new Exp.Type();
    }
    else if (value instanceof Value.StrType) {
        return new Exp.StrType();
    }
    else if (value instanceof Value.Str) {
        let { str } = value;
        return new Exp.Str(str);
    }
    else if (value instanceof Value.Pi) {
        let { scope, return_type, scope_env } = value;
        let { named_entries, new_scope_env } = scope_readback(scope, scope_env);
        return new Exp.Pi(new Scope.Scope(named_entries), readback(evaluate_1.evaluate(new_scope_env, return_type)));
    }
    else if (value instanceof Value.Fn) {
        let { scope, body, scope_env } = value;
        let { named_entries, new_scope_env } = scope_readback(scope, scope_env);
        return new Exp.Fn(new Scope.Scope(named_entries), readback(evaluate_1.evaluate(new_scope_env, body)));
    }
    else if (value instanceof Value.FnCase) {
        let { cases } = value;
        return new Exp.FnCase(cases.map(fn => {
            let { scope, body, scope_env } = fn;
            let { named_entries, new_scope_env } = scope_readback(scope, scope_env);
            return new Exp.Fn(new Scope.Scope(named_entries), readback(evaluate_1.evaluate(new_scope_env, body)));
        }));
    }
    else if (value instanceof Value.Cl) {
        let { defined, scope, scope_env } = value;
        let named_entries_defined = [];
        for (let [name, the] of defined) {
            let { t, value } = the;
            named_entries_defined.push([name, new Scope.Entry.Define(readback(t), readback(value))]);
        }
        let { named_entries } = scope_readback(scope, scope_env);
        return new Exp.Cl(new Scope.Scope([
            ...named_entries_defined,
            ...named_entries,
        ]));
    }
    else if (value instanceof Value.Obj) {
        let { defined } = value;
        let named_entries = [];
        for (let [name, the] of defined) {
            let { t, value } = the;
            named_entries.push([name, new Scope.Entry.Define(readback(t), readback(value))]);
        }
        return new Exp.Obj(new Scope.Scope(named_entries));
    }
    else if (value instanceof Value.The) {
        let { t, value } = value;
        return new Exp.The(readback(t), readback(value));
    }
    else if (value instanceof Value.Neutral.Var) {
        let { name } = value;
        return new Exp.Var(name);
    }
    else if (value instanceof Value.Neutral.Ap) {
        let { target, args } = value;
        return new Exp.Ap(readback(target), args.map(arg => readback(arg)));
    }
    else if (value instanceof Value.Neutral.Dot) {
        let { target, field_name } = value;
        return new Exp.Dot(readback(target), field_name);
    }
    else {
        throw new Err.Report([
            "readback fail\n" +
                `unhandled class of Value: ${value.constructor.name}\n`
        ]);
    }
}
exports.readback = readback;
function scope_readback(scope, scope_env) {
    let named_entries = [];
    for (let [name, entry] of scope.named_entries) {
        if (entry instanceof Scope.Entry.Let) {
            let { value } = entry;
            let the = {
                t: infer_1.infer(scope_env, value),
                value: evaluate_1.evaluate(scope_env, value),
            };
            scope_env = scope_env.ext(name, the);
            named_entries.push([name, new Scope.Entry.Let(readback(the.value))]);
        }
        else if (entry instanceof Scope.Entry.Given) {
            let { t } = entry;
            let the = {
                t: evaluate_1.evaluate(scope_env, t),
                value: new Value.Neutral.Var(name),
            };
            scope_env = scope_env.ext(name, the);
            named_entries.push([name, new Scope.Entry.Given(readback(the.t))]);
        }
        else if (entry instanceof Scope.Entry.Define) {
            let { t, value } = entry;
            let the = {
                t: evaluate_1.evaluate(scope_env, t),
                value: evaluate_1.evaluate(scope_env, value),
            };
            scope_env = scope_env.ext(name, the);
            named_entries.push([name, new Scope.Entry.Define(readback(the.t), readback(the.value))]);
        }
        else {
            throw new Err.Report([
                "scope_readback fail\n" +
                    `unhandled class of Scope.Entry: ${entry.constructor.name}\n`
            ]);
        }
    }
    return {
        named_entries,
        new_scope_env: scope_env,
    };
}
