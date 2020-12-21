import * as Exp from "../exp"
import * as Stmt from "../stmt"
import * as ut from "../../ut"

export function repr(exp: Exp.Exp): string {
  switch (exp.kind) {
    case "Exp.v": {
      return exp.repr()
    }
    case "Exp.pi": {
      return exp.repr()
    }
    case "Exp.fn": {
      return exp.repr()
    }
    case "Exp.ap": {
      return exp.repr()
    }
    case "Exp.sigma": {
      return exp.repr()
    }
    case "Exp.cons": {
      return exp.repr()
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
      return exp.repr()
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
    case "Exp.begin": {
      const s = [...exp.stmts.map(Stmt.repr), repr(exp.ret)].join("\n")
      return `{\n${ut.indent(s, "  ")}\n}`
    }
    case "Exp.the": {
      return `{ ${Exp.repr(exp.t)} -- ${Exp.repr(exp.exp)} }`
    }
  }
}
