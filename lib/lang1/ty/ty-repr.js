"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.repr = void 0;
function repr(t) {
    switch (t.kind) {
        case "Ty.nat": {
            return "Nat";
        }
        case "Ty.arrow": {
            return `(${repr(t.arg_t)}) -> ${repr(t.ret_t)}`;
        }
    }
}
exports.repr = repr;
