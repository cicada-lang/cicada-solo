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
      return exp.repr()
    }
    case "Exp.cdr": {
      return exp.repr()
    }
    case "Exp.nat": {
      return exp.repr()
    }
    case "Exp.zero": {
      return exp.repr()
    }
    case "Exp.add1": {
      return exp.repr()
    }
    case "Exp.nat_ind": {
      return exp.repr()
    }
    case "Exp.equal": {
      return exp.repr()
    }
    case "Exp.same": {
      return exp.repr()
    }
    case "Exp.replace": {
      return exp.repr()
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
      return exp.repr()
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
