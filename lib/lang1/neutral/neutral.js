"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.rec = exports.ap = exports.v = void 0;
exports.v = (name) => ({ kind: "Neutral.v", name });
exports.ap = (target, arg) => ({
    kind: "Neutral.ap",
    target,
    arg,
});
exports.rec = (ret_t, target, base, step) => ({
    kind: "Neutral.rec",
    ret_t,
    target,
    base,
    step,
});
