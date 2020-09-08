"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.the = exports.rec = exports.add1 = exports.zero = exports.suite = exports.ap = exports.fn = exports.v = void 0;
exports.v = (name) => ({ kind: "Exp.v", name });
exports.fn = (name, ret) => ({
    kind: "Exp.fn",
    name,
    ret,
});
exports.ap = (target, arg) => ({
    kind: "Exp.ap",
    target,
    arg,
});
exports.suite = (defs, ret) => ({
    kind: "Exp.suite",
    defs,
    ret,
});
exports.zero = { kind: "Exp.zero" };
exports.add1 = (prev) => ({ kind: "Exp.add1", prev });
exports.rec = (t, target, base, step) => ({
    kind: "Exp.rec",
    t,
    target,
    base,
    step,
});
exports.the = (t, exp) => ({ kind: "Exp.the", t, exp });
