"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Normal = void 0;
// NOTE
// We need type in normal form,
// because each type can have its own equality
// (such as eta equivalence of function type),
// and normal form is defined as,
// the canonical representative of the equivalence class
// induced by the equality judgment,
// such that comparing normal forms for alpha-equivalence
// is sufficient to decide whether two expressions are equal.
// NOTE
// Normal form require equality,
// equality require type,
// thus normal form require type.
class Normal {
    constructor(t, value) {
        this.t = t;
        this.value = value;
    }
}
exports.Normal = Normal;
