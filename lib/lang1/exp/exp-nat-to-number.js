"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.nat_to_number = void 0;
function nat_to_number(exp) {
    if (exp.kind === "Exp.zero") {
        return 0;
    }
    else if (exp.kind === "Exp.add1") {
        const almost = nat_to_number(exp.prev);
        if (almost !== undefined) {
            return 1 + almost;
        }
        else {
            return undefined;
        }
    }
    else {
        return undefined;
    }
}
exports.nat_to_number = nat_to_number;
