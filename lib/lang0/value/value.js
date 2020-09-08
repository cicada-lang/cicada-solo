"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.reflection = exports.fn = void 0;
exports.fn = (name, ret, env) => ({
    kind: "Value.fn",
    name,
    ret,
    env,
});
exports.reflection = (neutral) => ({
    kind: "Value.reflection",
    neutral,
});
