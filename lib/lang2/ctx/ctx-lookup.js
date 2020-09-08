"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.lookup = void 0;
function lookup(ctx, name) {
    const entry = ctx.get(name);
    if (entry !== undefined) {
        return entry.t;
    }
    else {
        return undefined;
    }
}
exports.lookup = lookup;
