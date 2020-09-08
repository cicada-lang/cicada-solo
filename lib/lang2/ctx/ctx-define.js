"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.define = void 0;
function define(ctx, name, t, value) {
    ctx.set(name, { t, value });
    return ctx;
}
exports.define = define;
