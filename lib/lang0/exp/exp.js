"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.suite = exports.ap = exports.fn = exports.v = void 0;
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
