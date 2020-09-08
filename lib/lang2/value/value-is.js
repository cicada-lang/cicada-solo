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
exports.is_str = exports.is_trivial = exports.is_absurd = exports.is_equal = exports.is_nat = exports.is_sigma = exports.is_pi = void 0;
const Value = __importStar(require("../value"));
const Trace = __importStar(require("../../trace"));
function is_pi(ctx, value) {
    if (value.kind === "Value.pi") {
        return value;
    }
    else {
        throw new Trace.Trace(Value.unexpected(ctx, value, { message: `I am expecting the type pi.` }));
    }
}
exports.is_pi = is_pi;
function is_sigma(ctx, value) {
    if (value.kind === "Value.sigma") {
        return value;
    }
    else {
        throw new Trace.Trace(Value.unexpected(ctx, value, {
            message: `I am expecting the type sigma.`,
        }));
    }
}
exports.is_sigma = is_sigma;
function is_nat(ctx, value) {
    if (value.kind === "Value.nat") {
        return value;
    }
    else {
        throw new Trace.Trace(Value.unexpected(ctx, value, {
            message: `I am expecting the type nat.`,
        }));
    }
}
exports.is_nat = is_nat;
function is_equal(ctx, value) {
    if (value.kind === "Value.equal") {
        return value;
    }
    else {
        throw new Trace.Trace(Value.unexpected(ctx, value, {
            message: `I am expecting the type equal.`,
        }));
    }
}
exports.is_equal = is_equal;
function is_absurd(ctx, value) {
    if (value.kind === "Value.absurd") {
        return value;
    }
    else {
        throw new Trace.Trace(Value.unexpected(ctx, value, {
            message: `I am expecting the type absurd.`,
        }));
    }
}
exports.is_absurd = is_absurd;
function is_trivial(ctx, value) {
    if (value.kind === "Value.trivial") {
        return value;
    }
    else {
        throw new Trace.Trace(Value.unexpected(ctx, value, {
            message: `I am expecting the type trivial.`,
        }));
    }
}
exports.is_trivial = is_trivial;
function is_str(ctx, value) {
    if (value.kind === "Value.str") {
        return value;
    }
    else {
        throw new Trace.Trace(Value.unexpected(ctx, value, {
            message: `I am expecting the type string.`,
        }));
    }
}
exports.is_str = is_str;
