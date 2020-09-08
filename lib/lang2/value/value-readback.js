"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.readback = void 0;
const Value = __importStar(require("../value"));
const Closure = __importStar(require("../closure"));
const Neutral = __importStar(require("../neutral"));
const Exp = __importStar(require("../exp"));
const Ctx = __importStar(require("../ctx"));
const freshen_1 = require("./freshen");
const ut = __importStar(require("../../ut"));
function readback(ctx, t, value) {
    if (t.kind === "Value.nat" && value.kind === "Value.zero") {
        return Exp.zero;
    }
    else if (t.kind === "Value.nat" && value.kind === "Value.add1") {
        return Exp.add1(Value.readback(ctx, t, value.prev));
    }
    else if (t.kind === "Value.pi") {
        // NOTE everything with a function type
        //   is immediately read back as having a Lambda on top.
        //   This implements the η-rule for functions.
        const fresh_name = freshen_1.freshen(new Set(ctx.keys()), t.closure.name);
        const variable = Value.reflection(t.arg_t, Neutral.v(fresh_name));
        return Exp.fn(fresh_name, Value.readback(Ctx.extend(Ctx.clone(ctx), fresh_name, t.arg_t), Closure.apply(t.closure, variable), Exp.do_ap(value, variable)));
    }
    else if (t.kind === "Value.sigma") {
        // NOTE Pairs are also η-expanded.
        //   Every value with a pair type,
        //   whether it is neutral or not,
        //   is read back with cons at the top.
        const car = Exp.do_car(value);
        const cdr = Exp.do_cdr(value);
        return Exp.cons(Value.readback(ctx, t.car_t, car), Value.readback(ctx, Closure.apply(t.closure, car), cdr));
    }
    else if (t.kind === "Value.trivial") {
        // NOTE the η-rule for trivial states that
        //   all of its inhabitants are the same as sole.
        //   This is implemented by reading the all back as sole.
        return Exp.sole;
    }
    else if (t.kind === "Value.absurd" &&
        value.kind === "Value.reflection" &&
        value.t.kind === "Value.absurd") {
        return Exp.the(Exp.absurd, Neutral.readback(ctx, value.neutral));
    }
    else if (t.kind === "Value.equal" && value.kind === "Value.same") {
        return Exp.same;
    }
    else if (t.kind === "Value.str" && value.kind === "Value.quote") {
        return Exp.quote(value.str);
    }
    else if (t.kind === "Value.type" && value.kind === "Value.nat") {
        return Exp.nat;
    }
    else if (t.kind === "Value.type" && value.kind === "Value.str") {
        return Exp.str;
    }
    else if (t.kind === "Value.type" && value.kind === "Value.trivial") {
        return Exp.trivial;
    }
    else if (t.kind === "Value.type" && value.kind === "Value.absurd") {
        return Exp.absurd;
    }
    else if (t.kind === "Value.type" && value.kind === "Value.equal") {
        return Exp.equal(Value.readback(ctx, Value.type, value.t), Value.readback(ctx, value.t, value.from), Value.readback(ctx, value.t, value.to));
    }
    else if (t.kind === "Value.type" && value.kind === "Value.sigma") {
        const fresh_name = freshen_1.freshen(new Set(ctx.keys()), value.closure.name);
        const variable = Value.reflection(value.car_t, Neutral.v(fresh_name));
        const car_t = Value.readback(ctx, Value.type, value.car_t);
        const cdr_t = Value.readback(Ctx.extend(Ctx.clone(ctx), fresh_name, value.car_t), Value.type, Closure.apply(value.closure, variable));
        return Exp.sigma(fresh_name, car_t, cdr_t);
    }
    else if (t.kind === "Value.type" && value.kind === "Value.pi") {
        const fresh_name = freshen_1.freshen(new Set(ctx.keys()), value.closure.name);
        const variable = Value.reflection(value.arg_t, Neutral.v(fresh_name));
        const arg_t = Value.readback(ctx, Value.type, value.arg_t);
        const ret_t = Value.readback(Ctx.extend(Ctx.clone(ctx), fresh_name, value.arg_t), Value.type, Closure.apply(value.closure, variable));
        return Exp.pi(fresh_name, arg_t, ret_t);
    }
    else if (t.kind === "Value.type" && value.kind === "Value.type") {
        return Exp.type;
    }
    else if (value.kind === "Value.reflection") {
        // NOTE  t and value.t are ignored here,
        //  maybe use them to debug.
        return Neutral.readback(ctx, value.neutral);
    }
    else {
        throw new Error(ut.aline(`
      |I can not readback value: ${ut.inspect(value)},
      |of type: ${ut.inspect(t)}.
      |`));
    }
}
exports.readback = readback;
