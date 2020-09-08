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
exports.exp_matcher = exports.exp = void 0;
const Exp = __importStar(require("../exp"));
const partech_1 = __importDefault(require("@forchange/partech"));
const readable_regular_expression_1 = __importDefault(require("@forchange/readable-regular-expression"));
const preserved_identifiers = [
    "Pair",
    "cons",
    "car",
    "cdr",
    "Nat",
    "zero",
    "add1",
    "Equal",
    "same",
    "replace",
    "Trivial",
    "sole",
    "Absurd",
    "String",
    "Type",
];
const identifier = new partech_1.default.Sym.Pat(/^identifier/, readable_regular_expression_1.default.seq(readable_regular_expression_1.default.negative_lookahead(readable_regular_expression_1.default.beginning, readable_regular_expression_1.default.or(...preserved_identifiers)), readable_regular_expression_1.default.word), { name: "identifier" });
const str = partech_1.default.Sym.create_par_from_kind("string", { name: "string" });
function str_matcher(tree) {
    const s = partech_1.default.Tree.token(tree).value;
    return s.slice(1, s.length - 1);
}
const num = partech_1.default.Sym.create_par_from_kind("number", { name: "number" });
function num_matcher(tree) {
    const s = partech_1.default.Tree.token(tree).value;
    return Number.parseInt(s);
}
function type_assignment() {
    return partech_1.default.Sym.create_rule("type_assignment", {
        named: [identifier, ":", exp],
        unnamed: [exp],
    });
}
function type_assignment_matcher(tree) {
    return partech_1.default.Tree.matcher("type_assignment", {
        named: ([name, , t]) => {
            return {
                name: partech_1.default.Tree.token(name).value,
                t: exp_matcher(t),
            };
        },
        unnamed: ([t]) => {
            return {
                name: "_",
                t: exp_matcher(t),
            };
        },
    })(tree);
}
function exp() {
    return partech_1.default.Sym.create_rule("exp", {
        var: [identifier],
        pi: ["(", comma_separated(type_assignment), ")", "-", ">", exp],
        fn: ["(", comma_separated(identifier), ")", "=", ">", exp],
        ap: [
            identifier,
            partech_1.default.one_or_more(in_between("(", comma_separated(exp), ")")),
        ],
        sigma: ["(", identifier, ":", exp, ")", "*", exp],
        pair: ["Pair", "(", exp, ",", exp, ")"],
        cons: ["cons", "(", exp, ",", exp, ")"],
        car: ["car", "(", exp, ")"],
        cdr: ["cdr", "(", exp, ")"],
        nat: ["Nat"],
        zero: ["zero"],
        add1: ["add1", "(", exp, ")"],
        number: [num],
        nat_ind: ["Nat", ".", "ind", "(", exp, ",", exp, ",", exp, ",", exp, ")"],
        equal: ["Equal", "(", exp, ",", exp, ",", exp, ")"],
        same: ["same"],
        replace: ["replace", "(", exp, ",", exp, ",", exp, ")"],
        trivial: ["Trivial"],
        sole: ["sole"],
        absurd: ["Absurd"],
        absurd_ind: ["Absurd", ".", "ind", "(", exp, ",", exp, ")"],
        str: ["String"],
        quote: [str],
        type: ["Type"],
        suite: ["{", partech_1.default.zero_or_more(def), exp, "}"],
        the: [exp, ":", exp],
    });
}
exports.exp = exp;
function exp_matcher(tree) {
    return partech_1.default.Tree.matcher("exp", {
        var: ([name]) => {
            return Exp.v(partech_1.default.Tree.token(name).value);
        },
        pi: ([, comma_separated_type_assignments, , , , ret_t]) => {
            const type_assignments = comma_separated_matcher(type_assignment_matcher)(comma_separated_type_assignments);
            let exp = exp_matcher(ret_t);
            for (let i = type_assignments.length - 1; i >= 0; i--) {
                exp = Exp.pi(type_assignments[i].name, type_assignments[i].t, exp);
            }
            return exp;
        },
        fn: ([, comma_separated_names, , , , ret]) => {
            const names = comma_separated_matcher((name) => partech_1.default.Tree.token(name).value)(comma_separated_names);
            let exp = exp_matcher(ret);
            for (let i = names.length - 1; i >= 0; i--) {
                exp = Exp.fn(names[i], exp);
            }
            return exp;
        },
        ap: ([name, exp_in_paren_list]) => {
            let exp = Exp.v(partech_1.default.Tree.token(name).value);
            const args_list = partech_1.default.one_or_more_matcher(in_between_matcher(comma_separated_matcher(exp_matcher)))(exp_in_paren_list);
            for (const args of args_list) {
                for (const arg of args) {
                    exp = Exp.ap(exp, arg);
                }
            }
            return exp;
        },
        sigma: ([, name, , car_t, , , cdr_t]) => {
            return Exp.sigma(partech_1.default.Tree.token(name).value, exp_matcher(car_t), exp_matcher(cdr_t));
        },
        pair: ([, , car_t, , cdr_t]) => {
            return Exp.sigma("_", exp_matcher(car_t), exp_matcher(cdr_t));
        },
        cons: ([, , car, , cdr]) => {
            return Exp.cons(exp_matcher(car), exp_matcher(cdr));
        },
        car: ([, , target]) => {
            return Exp.car(exp_matcher(target));
        },
        cdr: ([, , target]) => {
            return Exp.cdr(exp_matcher(target));
        },
        nat: (_) => {
            return Exp.nat;
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
        nat_ind: ([, , , , target, , motive, , base, , step]) => {
            return Exp.nat_ind(exp_matcher(target), exp_matcher(motive), exp_matcher(base), exp_matcher(step));
        },
        equal: ([, , t, , from, , to]) => {
            return Exp.equal(exp_matcher(t), exp_matcher(from), exp_matcher(to));
        },
        same: (_) => {
            return Exp.same;
        },
        replace: ([, , target, , motive, , base]) => {
            return Exp.replace(exp_matcher(target), exp_matcher(motive), exp_matcher(base));
        },
        trivial: (_) => {
            return Exp.trivial;
        },
        sole: (_) => {
            return Exp.sole;
        },
        absurd: (_) => {
            return Exp.absurd;
        },
        absurd_ind: ([, , , , target, , motive]) => {
            return Exp.absurd_ind(exp_matcher(target), exp_matcher(motive));
        },
        str: (_) => {
            return Exp.str;
        },
        quote: ([str]) => {
            return Exp.quote(str_matcher(str));
        },
        type: (_) => {
            return Exp.type;
        },
        suite: ([, defs, ret]) => {
            return Exp.suite(partech_1.default.zero_or_more_matcher(def_matcher)(defs), exp_matcher(ret));
        },
        the: ([exp, , t]) => {
            return Exp.the(exp_matcher(t), exp_matcher(exp));
        },
    })(tree);
}
exports.exp_matcher = exp_matcher;
function comma_after(x) {
    return partech_1.default.Sym.create_rule("comma_after", {
        comma_after: [x, ","],
    });
}
function comma_after_matcher(matcher) {
    return partech_1.default.Tree.matcher("comma_after", {
        comma_after: ([x]) => matcher(x),
    });
}
function comma_separated(x) {
    return partech_1.default.Sym.create_rule("comma_separated", {
        comma_separated: [partech_1.default.zero_or_more(comma_after(x)), x],
    });
}
function comma_separated_matcher(matcher) {
    return partech_1.default.Tree.matcher("comma_separated", {
        comma_separated: ([comma_separated, x]) => {
            return [
                ...partech_1.default.zero_or_more_matcher(comma_after_matcher(matcher))(comma_separated),
                matcher(x),
            ];
        },
    });
}
function in_between(before, x, after) {
    return partech_1.default.Sym.create_rule("in_between", {
        in_between: [before, x, after],
    });
}
function in_between_matcher(matcher) {
    return partech_1.default.Tree.matcher("in_between", {
        in_between: ([, x]) => matcher(x),
    });
}
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
