var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) result[k] = mod[k];
    result["default"] = mod;
    return result;
};
(function (factory) {
    if (typeof module === "object" && typeof module.exports === "object") {
        var v = factory(require, exports);
        if (v !== undefined) module.exports = v;
    }
    else if (typeof define === "function" && define.amd) {
        define(["require", "exports", "./exp", "./scope"], factory);
    }
})(function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    const Exp = __importStar(require("./exp"));
    const Scope = __importStar(require("./scope"));
    function pretty_exp(exp) {
        if (exp instanceof Exp.Var) {
            let { name } = exp;
            return name;
        }
        else if (exp instanceof Exp.Type) {
            return "type";
        }
        else if (exp instanceof Exp.StrType) {
            return "string_t";
        }
        else if (exp instanceof Exp.Str) {
            let { str } = exp;
            return `"${str}"`;
        }
        else if (exp instanceof Exp.Pi) {
            let { scope, return_type } = exp;
            let s = pretty_scope(scope, "\n");
            s += `-> ${pretty_exp(return_type)}\n`;
            return pretty_flower_block(s);
        }
        // case Fn(type_map: ListMap[String, Exp], body: Exp) =>
        //   var s = type_map.map {
        //     case (name, exp) => s"${name} : ${pretty_exp(exp)}\n"
        //   }.mkString("")
        //   s = s + s"=> ${pretty_exp(body)}\n"
        //   s"{${maybe_ln(s)}}"
        // case FnCase(cases) =>
        //   var s = cases.map {
        //     case (type_map, body) =>
        //       var s = type_map.map {
        //         case (name, exp) => s"${name} : ${pretty_exp(exp)}"
        //       }.mkString(", ")
        //       s"case ${s} => ${pretty_exp(body)}\n"
        //   }.mkString("")
        //   s"{${maybe_ln(s)}}"
        // case Ap(target: Exp, args: List[Exp]) =>
        //   val s = args.map {
        //     case exp => pretty_exp(exp)
        //   }.mkString(", ")
        //   s"${pretty_exp(target)}(${s})"
        // case Cl(defined, type_map: ListMap[String, Exp]) =>
        //   var d = defined.map {
        //     case (name, (t, exp)) => s"${name} : ${pretty_exp(t)} = ${pretty_exp(exp)}\n"
        //   }.mkString("")
        //   var s = type_map.map {
        //     case (name, exp) => s"${name} : ${pretty_exp(exp)}\n"
        //   }.mkString("")
        //   s"class {${maybe_ln(d)}${maybe_ln(s)}}"
        // case Obj(value_map: ListMap[String, Exp]) =>
        //   var s = value_map.map {
        //     case (name, exp) => s"${name} = ${pretty_exp(exp)}\n"
        //   }.mkString("")
        //   s"object {${maybe_ln(s)}}"
        // case Dot(target: Exp, field: String) =>
        //   s"${pretty_exp(target)}.${field}"
        // case Block(block_entry_map: ListMap[String, BlockEntry], body: Exp) =>
        //   var s = block_entry_map.map {
        //     case (name, BlockEntryLet(exp)) => s"${name} = ${pretty_exp(exp)}\n"
        //     case (name, BlockEntryDefine(t, exp)) => s"${name} : ${pretty_exp(t)} = ${pretty_exp(exp)}\n"
        //   }.mkString("")
        //   s = s + s"${pretty_exp(body)}\n"
        //   s"{${maybe_ln(s)}}"
        else {
            throw new Error("pretty_exp fail\n" +
                `unhandled class of Exp: ${exp.constructor.name}`);
        }
    }
    exports.pretty_exp = pretty_exp;
    function pretty_value(value) {
        throw new Error("TODO");
    }
    exports.pretty_value = pretty_value;
    function pretty_scope(scope, delimiter) {
        let list = [];
        for (let [name, entry] of scope.named_entries) {
            if (entry instanceof Scope.Entry.Let) {
                let { value } = entry;
                list.push(`${name} = ${pretty_exp(value)}`);
            }
            else if (entry instanceof Scope.Entry.Given) {
                let { t } = entry;
                list.push(`${name} : ${pretty_exp(t)}`);
            }
            else if (entry instanceof Scope.Entry.Define) {
                let { t, value } = entry;
                list.push(`${name} : ${pretty_exp(t)} = ${pretty_exp(value)}`);
            }
            else {
                throw new Error("pretty_scope fail\n" +
                    `unhandled class of Scope.Entry: ${entry.constructor.name}`);
            }
        }
        return list.join(delimiter);
    }
    exports.pretty_scope = pretty_scope;
    function indent(text, indentation = "  ") {
        return text
            .split("\n")
            .map(line => indentation + line)
            .join("\n");
    }
    exports.indent = indent;
    function pretty_flower_block(text, indentation = "  ") {
        return text === ""
            ? "{}"
            : "{" + "\n" + indent(text) + "\n" + "}";
    }
    exports.pretty_flower_block = pretty_flower_block;
});
