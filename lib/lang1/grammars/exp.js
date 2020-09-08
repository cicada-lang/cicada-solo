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
exports.def_matcher = exports.exp_in_paren_matcher = exports.exp_matcher = exports.exp = exports.ty_matcher = exports.ty = void 0;
const Exp = __importStar(require("../exp"));
const Ty = __importStar(require("../ty"));
const partech_1 = __importDefault(require("@forchange/partech"));
const readable_regular_expression_1 = __importDefault(require("@forchange/readable-regular-expression"));
const preserved_identifiers = ["zero", "add1", "rec"];
const identifier = new partech_1.default.Sym.Pat(/^identifier/, readable_regular_expression_1.default.seq(readable_regular_expression_1.default.negative_lookahead(readable_regular_expression_1.default.beginning, readable_regular_expression_1.default.or(...preserved_identifiers)), readable_regular_expression_1.default.word), { name: "identifier" });
const num = partech_1.default.Sym.create_par_from_kind("number", { name: "number" });
function num_matcher(tree) {
    const s = partech_1.default.Tree.token(tree).value;
    return Number.parseInt(s);
}
function ty() {
    return partech_1.default.Sym.create_rule("ty", {
        nat: ["Nat"],
        arrow: ["(", ty, ")", "-", ">", ty],
    });
}
exports.ty = ty;
function ty_matcher(tree) {
    return partech_1.default.Tree.matcher("ty", {
        nat: (_) => {
            return Ty.nat;
        },
        arrow: ([, arg, , , , ret]) => {
            return Ty.arrow(ty_matcher(arg), ty_matcher(ret));
        },
    })(tree);
}
exports.ty_matcher = ty_matcher;
function exp() {
    return partech_1.default.Sym.create_rule("exp", {
        var: [identifier],
        fn: ["(", identifier, ")", "=", ">", exp],
        ap: [identifier, partech_1.default.one_or_more(exp_in_paren)],
        suite: ["{", partech_1.default.zero_or_more(def), exp, "}"],
        zero: ["zero"],
        add1: ["add1", "(", exp, ")"],
        number: [num],
        rec: ["rec", "[", ty, "]", "(", exp, ",", exp, ",", exp, ")"],
        the: [exp, ":", ty],
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
        zero: (_) => {
            return Exp.zero;
        },
        add1: ([, , prev]) => {
            return Exp.add1(exp_matcher(prev));
        },
        number: ([num]) => {
            const n = num_matcher(num);
            return Exp.nat_from_number(n);
        },
        rec: ([, , t, , , target, , base, , step]) => {
            return Exp.rec(ty_matcher(t), exp_matcher(target), exp_matcher(base), exp_matcher(step));
        },
        the: ([exp, , t]) => {
            return Exp.the(ty_matcher(t), exp_matcher(exp));
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
