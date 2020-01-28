"use strict";
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) result[k] = mod[k];
    result["default"] = mod;
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
const rule_1 = require("@forchange/partech/lib/rule");
const AST = __importStar(require("@forchange/partech/lib/tree"));
const ptc = __importStar(require("@forchange/partech/lib/predefined"));
const predefined_1 = require("@forchange/partech/lib/predefined");
const Top = __importStar(require("./top"));
const Exp = __importStar(require("./exp"));
const Scope = __importStar(require("./scope"));
const preserved = [
    "type", "class",
    "choice", "case",
    "string_t",
];
const identifier = ptc.identifier_with_preserved("identifier", preserved);
function top_entry() {
    return new rule_1.Rule("top_entry", {
        "named_entry": [named_entry],
        "@refuse": ["@", "refuse", exp, ":", exp],
        "@accept": ["@", "accept", exp, ":", exp],
        "@show": ["@", "show", exp],
        "@eq": ["@", "eq", exp, "=", exp],
    });
}
const top_entry_matcher = AST.Node.matcher_with_span(span => [
    "top_entry", {
        "named_entry": ([named_entry]) => new Top.TopNamedScopeEntry(...named_entry_matcher(named_entry)),
        "@refuse": ([, , exp, , t]) => new Top.TopKeywordRefuse(exp_matcher(exp), exp_matcher(t)),
        "@accept": ([, , exp, , t]) => new Top.TopKeywordAccept(exp_matcher(exp), exp_matcher(t)),
        "@show": ([, , exp]) => new Top.TopKeywordShow(exp_matcher(exp)),
        "@eq": ([, , rhs, , lhs]) => new Top.TopKeywordEq(exp_matcher(rhs), exp_matcher(lhs)),
    }
]);
function top_list() {
    return new rule_1.Rule("top_list", {
        "top_entry_list": [predefined_1.ap(ptc.non_empty_list, top_entry)],
    });
}
exports.top_list = top_list;
exports.top_list_matcher = AST.Node.matcher_with_span(span => [
    "top_list", {
        "top_entry_list": ([top_entry_list]) => ptc.non_empty_list_matcher(top_entry_matcher)(top_entry_list),
    }
]);
function scope() {
    return new rule_1.Rule("scope", {
        "named_entries": [predefined_1.ap(ptc.non_empty_list, named_entry)],
    });
}
const scope_matcher = AST.Node.matcher_with_span(span => [
    "scope", {
        "named_entries": ([named_entries]) => new Scope.Scope(ptc.non_empty_list_matcher(named_entry_matcher)(named_entries)),
    }
]);
function named_entry() {
    return new rule_1.Rule("named_entry", {
        "let": [identifier, "=", exp],
        "let_comma": [identifier, "=", exp, ","],
        "given": [identifier, ":", exp],
        "given_comma": [identifier, ":", exp, ","],
        "define": [identifier, ":", exp, "=", exp],
        "define_comma": [identifier, ":", exp, "=", exp, ","],
        "cl": ["class", identifier, "{", scope, "}"],
        "cl_empty": ["class", identifier, "{", "}"],
    });
}
const named_entry_matcher = AST.Node.matcher_with_span(span => [
    "named_entry", {
        "let": ([name, , exp]) => [AST.Leaf.word(name), new Scope.Entry.Let(exp_matcher(exp))],
        "let_comma": ([name, , exp,]) => [AST.Leaf.word(name), new Scope.Entry.Let(exp_matcher(exp))],
        "given": ([name, , t]) => [AST.Leaf.word(name), new Scope.Entry.Given(exp_matcher(t))],
        "given_comma": ([name, , t,]) => [AST.Leaf.word(name), new Scope.Entry.Given(exp_matcher(t))],
        "define": ([name, , t, , exp]) => [AST.Leaf.word(name), new Scope.Entry.Define(exp_matcher(t), exp_matcher(exp))],
        "define_comma": ([name, , t, , exp,]) => [AST.Leaf.word(name), new Scope.Entry.Define(exp_matcher(t), exp_matcher(exp))],
        "cl": ([, name, , scope,]) => [AST.Leaf.word(name), new Scope.Entry.Define(new Exp.Type(), new Exp.Cl(scope_matcher(scope)))],
        "cl_empty": ([, name, ,]) => [AST.Leaf.word(name), new Scope.Entry.Define(new Exp.Type(), new Exp.Cl(new Scope.Scope()))],
    }
]);
function exp() {
    return new rule_1.Rule("exp", {
        "var": [identifier],
        "type": ["type"],
        "string_t": ["string_t"],
        "string": [ptc.double_quoted_string],
        "pi": ["{", scope, "-", ">", exp, "}"],
        "fn": ["{", scope, "=", ">", exp, "}"],
        "fn_case": ["choice", "{", predefined_1.ap(ptc.non_empty_list, fn_case_clause), "}"],
        "ap": [exp, "(", predefined_1.ap(ptc.non_empty_list, arg_entry), ")"],
        "cl": ["class", "{", scope, "}"],
        "cl_empty": ["class", "{", "}"],
        "obj": ["{", scope, "}"],
        "obj_empty": ["{", "}"],
        "dot": [exp, ".", identifier],
        "block": ["{", scope, exp, "}"],
    });
}
const exp_matcher = AST.Node.matcher_with_span(span => [
    "exp", {
        "var": ([name]) => new Exp.Var(AST.Leaf.word(name)),
        "type": _ => new Exp.Type(),
        "string_t": _ => new Exp.StrType(),
        "string": ([str]) => {
            let s = AST.Leaf.word(str);
            return new Exp.Str(s.slice(1, s.length - 1));
        },
        "pi": ([, scope, , , return_type, _]) => new Exp.Pi(scope_matcher(scope), exp_matcher(return_type)),
        "fn": ([, scope, , , body, _]) => new Exp.Fn(scope_matcher(scope), exp_matcher(body)),
        "fn_case": ([, , fn_case_clause_list, _]) => new Exp.FnCase(ptc.non_empty_list_matcher(fn_case_clause_matcher)(fn_case_clause_list)),
        "ap": ([target, , arg_entry_list, _]) => new Exp.Ap(exp_matcher(target), ptc.non_empty_list_matcher(arg_entry_matcher)(arg_entry_list)),
        "cl": ([, , scope, _]) => new Exp.Cl(scope_matcher(scope)),
        "cl_empty": _ => new Exp.Cl(new Scope.Scope()),
        "obj": ([, scope, _]) => new Exp.Obj(scope_matcher(scope)),
        "obj_empty": _ => new Exp.Obj(new Scope.Scope()),
        "dot": ([target, , field_name]) => new Exp.Dot(exp_matcher(target), AST.Leaf.word(field_name)),
        "block": ([, scope, body, _]) => new Exp.Block(scope_matcher(scope), exp_matcher(body)),
    }
]);
function fn_case_clause() {
    return new rule_1.Rule("fn_case_clause", {
        "case": ["case", scope, "=", ">", exp],
    });
}
const fn_case_clause_matcher = AST.Node.matcher_with_span(span => [
    "fn_case_clause", {
        "case": ([, scope, , , body]) => new Exp.Fn(scope_matcher(scope), exp_matcher(body)),
    }
]);
function arg_entry() {
    return new rule_1.Rule("arg_entry", {
        "arg": [exp],
        "arg_comma": [exp, ","],
    });
}
const arg_entry_matcher = AST.Node.matcher_with_span(span => [
    "arg_entry", {
        "arg": ([exp]) => exp_matcher(exp),
        "arg_comma": ([exp, _]) => exp_matcher(exp),
    }
]);
