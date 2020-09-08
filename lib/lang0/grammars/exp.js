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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.def_matcher = exports.exp_in_paren_matcher = exports.exp_matcher = exports.exp = void 0;
const Exp = __importStar(require("../exp"));
const partech_1 = __importDefault(require("@forchange/partech"));
const identifier = partech_1.default.Sym.create_par_from_kind("identifier");
function exp() {
    return partech_1.default.Sym.create_rule("exp", {
        var: [identifier],
        fn: ["(", identifier, ")", "=", ">", exp],
        ap: [identifier, partech_1.default.one_or_more(exp_in_paren)],
        suite: ["{", partech_1.default.zero_or_more(def), exp, "}"],
    });
}
exports.exp = exp;
function exp_matcher(tree) {
    return partech_1.default.Tree.matcher("exp", {
        var: ([name]) => {
            return Exp.v(partech_1.default.Tree.token(name).value);
        },
        fn: ([, name, , , , ret]) => {
            return Exp.fn(partech_1.default.Tree.token(name).value, exp_matcher(ret));
        },
        ap: ([name, exp_in_paren_list]) => {
            let exp = Exp.v(partech_1.default.Tree.token(name).value);
            const args = partech_1.default.one_or_more_matcher(exp_in_paren_matcher)(exp_in_paren_list);
            for (const arg of args) {
                exp = Exp.ap(exp, arg);
            }
            return exp;
        },
        suite: ([, defs, ret]) => {
            return Exp.suite(partech_1.default.zero_or_more_matcher(def_matcher)(defs), exp_matcher(ret));
        },
    })(tree);
}
exports.exp_matcher = exp_matcher;
function exp_in_paren() {
    return partech_1.default.Sym.create_rule("exp_in_paren", {
        exp_in_paren: ["(", exp, ")"],
    });
}
function exp_in_paren_matcher(tree) {
    return partech_1.default.Tree.matcher("exp_in_paren", {
        exp_in_paren: ([, exp]) => exp_matcher(exp),
    })(tree);
}
exports.exp_in_paren_matcher = exp_in_paren_matcher;
function def() {
    return partech_1.default.Sym.create_rule("def", {
        def: [identifier, "=", exp],
    });
}
function def_matcher(tree) {
    return partech_1.default.Tree.matcher("def", {
        def: ([name, , exp]) => {
            return {
                name: partech_1.default.Tree.token(name).value,
                exp: exp_matcher(exp),
            };
        },
    })(tree);
}
exports.def_matcher = def_matcher;
