// sealed trait Exp
// final case class Var(name: String) extends Exp
// final case class Type() extends Exp
// final case class StrType() extends Exp
// final case class Str(str: String) extends Exp
// final case class Pi(type_map: ListMap[String, Exp], return_type: Exp) extends Exp
// final case class Fn(type_map: ListMap[String, Exp], body: Exp) extends Exp
// final case class FnCase(cases: List[(ListMap[String, Exp], Exp)]) extends Exp
// final case class Ap(target: Exp, arg_list: List[Exp]) extends Exp
// final case class Cl(defined: ListMap[String, (Exp, Exp)], type_map: ListMap[String, Exp]) extends Exp
// final case class Obj(value_map: ListMap[String, Exp]) extends Exp
// final case class Dot(target: Exp, field: String) extends Exp
// final case class Block(block_entry_map: ListMap[String, BlockEntry], body: Exp) extends Exp
(function (factory) {
    if (typeof module === "object" && typeof module.exports === "object") {
        var v = factory(require, exports);
        if (v !== undefined) module.exports = v;
    }
    else if (typeof define === "function" && define.amd) {
        define(["require", "exports"], factory);
    }
})(function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    // sealed trait BlockEntry
    // final case class BlockEntryLet(value: Exp) extends BlockEntry
    // final case class BlockEntryDefine(t: Exp, value: Exp) extends BlockEntry
    class Exp {
    }
    exports.Exp = Exp;
    class Var extends Exp {
        constructor(name) {
            super();
            this.name = name;
        }
    }
    exports.Var = Var;
    class Type extends Exp {
    }
    exports.Type = Type;
});
// final case class Type() extends Exp
// final case class StrType() extends Exp
// final case class Str(str: String) extends Exp
// final case class Pi(type_map: ListMap[String, Exp], return_type: Exp) extends Exp
// final case class Fn(type_map: ListMap[String, Exp], body: Exp) extends Exp
// final case class FnCase(cases: List[(ListMap[String, Exp], Exp)]) extends Exp
// final case class Ap(target: Exp, arg_list: List[Exp]) extends Exp
// final case class Cl(defined: ListMap[String, (Exp, Exp)], type_map: ListMap[String, Exp]) extends Exp
// final case class Obj(value_map: ListMap[String, Exp]) extends Exp
// final case class Dot(target: Exp, field: String) extends Exp
// final case class Block(block_entry_map: ListMap[String, BlockEntry], body: Exp) extends Exp
