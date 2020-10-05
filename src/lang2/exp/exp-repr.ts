import * as Exp from "../exp"
import * as Stmt from "../stmt"
import * as ut from "../../ut"

export function repr(exp: Exp.Exp): string {
  switch (exp.kind) {
    case "Exp.v": {
      return exp.name
    }
    case "Exp.pi": {
      return `(${exp.name}: ${Exp.repr(exp.arg_t)}) -> ${Exp.repr(exp.ret_t)}`
    }
    case "Exp.fn": {
      return `(${exp.name}) => ${Exp.repr(exp.ret)}`
    }
    case "Exp.ap": {
      return `${Exp.repr(exp.target)}(${Exp.repr(exp.arg)})`
    }
    case "Exp.sigma": {
      return `(${exp.name}: ${Exp.repr(exp.car_t)}) * ${Exp.repr(exp.cdr_t)}`
    }
    case "Exp.cons": {
      return `cons(${Exp.repr(exp.car)}, ${Exp.repr(exp.cdr)})`
    }
    case "Exp.car": {
      return `car(${Exp.repr(exp.target)})`
    }
    case "Exp.cdr": {
      return `cdr(${Exp.repr(exp.target)})`
    }
    case "Exp.nat": {
      return "Nat"
    }
    case "Exp.zero": {
      return "0"
    }
    case "Exp.add1": {
      const n = Exp.nat_to_number(exp)
      if (n !== undefined) {
        return n.toString()
      } else {
        return `add1(${Exp.repr(exp.prev)})`
      }
    }
    case "Exp.nat_ind": {
      return `Nat.ind(${Exp.repr(exp.target)}, ${Exp.repr(
        exp.motive
      )}, ${Exp.repr(exp.base)}, ${Exp.repr(exp.step)})`
    }
    case "Exp.equal": {
      return `Equal(${Exp.repr(exp.t)}, ${Exp.repr(exp.from)}, ${Exp.repr(
        exp.to
      )})`
    }
    case "Exp.same": {
      return "same"
    }
    case "Exp.replace": {
      return `replace(${Exp.repr(exp.target)}, ${Exp.repr(
        exp.motive
      )}, ${Exp.repr(exp.base)})`
    }
    case "Exp.trivial": {
      return "Trivial"
    }
    case "Exp.sole": {
      return "sole"
    }
    case "Exp.absurd": {
      return "Absurd"
    }
    case "Exp.absurd_ind": {
      return `Absurd.ind(${Exp.repr(exp.target)}, ${Exp.repr(exp.motive)})`
    }
    case "Exp.str": {
      return "String"
    }
    case "Exp.quote": {
      return `"${exp.str}"`
    }
    case "Exp.type": {
      return "Type"
    }
    case "Exp.suite": {
      const s = [...exp.stmts.map(Stmt.repr), repr(exp.ret)].join("\n")
      return `{\n${ut.indent(s, "  ")}\n}`
    }
    case "Exp.the": {
      return `${Exp.repr(exp.exp)}: ${Exp.repr(exp.t)}`
    }
  }
}
