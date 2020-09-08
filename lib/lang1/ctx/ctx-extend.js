"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.extend = void 0;
// NOTE side effect API,
//   one needs to clone the env as needed.
function extend(ctx, name, value) {
    ctx.set(name, value);
    return ctx;
}
exports.extend = extend;
