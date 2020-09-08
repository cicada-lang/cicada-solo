"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.add1 = exports.zero = exports.fn = exports.reflection = void 0;
exports.reflection = (t, neutral) => ({
    kind: "Value.reflection",
    t,
    neutral,
});
exports.fn = (name, ret, env) => ({
    kind: "Value.fn",
    name,
    ret,
    env,
});
exports.zero = {
    kind: "Value.zero",
};
exports.add1 = (prev) => ({
    kind: "Value.add1",
    prev,
});
