"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.extend = void 0;
function extend(ctx, name, t) {
    ctx.set(name, { t });
    return ctx;
}
exports.extend = extend;
