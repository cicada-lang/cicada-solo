"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Closure = void 0;
class Closure {
    constructor(env, name, ret) {
        this.env = env;
        this.name = name;
        this.ret = ret;
    }
}
exports.Closure = Closure;
