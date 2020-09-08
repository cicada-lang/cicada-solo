"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.arrow = exports.nat = void 0;
exports.nat = { kind: "Ty.nat" };
exports.arrow = (arg_t, ret_t) => ({
    kind: "Ty.arrow",
    arg_t,
    ret_t,
});
