"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.extend = void 0;
// NOTE side effect API,
//   one needs to clone the env as needed.
function extend(env, name, value) {
    env.set(name, value);
    return env;
}
exports.extend = extend;
