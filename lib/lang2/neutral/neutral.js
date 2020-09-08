"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.absurd_ind = exports.replace = exports.nat_ind = exports.cdr = exports.car = exports.ap = exports.v = void 0;
exports.v = (name) => ({
    kind: "Neutral.v",
    name,
});
exports.ap = (target, arg) => ({
    kind: "Neutral.ap",
    target,
    arg,
});
exports.car = (target) => ({
    kind: "Neutral.car",
    target,
});
exports.cdr = (target) => ({
    kind: "Neutral.cdr",
    target,
});
exports.nat_ind = (target, motive, base, step) => ({
    kind: "Neutral.nat_ind",
    target,
    motive,
    base,
    step,
});
exports.replace = (target, motive, base) => ({
    kind: "Neutral.replace",
    target,
    motive,
    base,
});
exports.absurd_ind = (target, motive) => ({
    kind: "Neutral.absurd_ind",
    target,
    motive,
});
