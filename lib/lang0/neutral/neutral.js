"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ap = exports.v = void 0;
exports.v = (name) => ({ kind: "Neutral.v", name });
exports.ap = (target, arg) => ({
    kind: "Neutral.ap",
    target,
    arg,
});
