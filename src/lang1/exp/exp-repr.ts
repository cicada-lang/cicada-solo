import * as Exp from "../exp"
import * as Stmt from "../stmt"
import * as Ty from "../ty"
import * as ut from "../../ut"

export function repr(exp: Exp.Exp): string {
  switch (exp.kind) {
    case "Exp.v": {
      return exp.name
    }
    case "Exp.fn": {
      return `(${exp.name}) => ${repr(exp.ret)}`
    }
    case "Exp.ap": {
      return `${repr(exp.target)}(${repr(exp.arg)})`
    }
    case "Exp.suite": {
      const s = [...exp.stmts.map(Stmt.repr), repr(exp.ret)].join("\n")
      return `{\n${ut.indent(s, "  ")}\n}`
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
    case "Exp.rec": {
      const { t, target, base, step } = exp
      return `rec[${Ty.repr(t)}](${repr(target)}, ${repr(base)}, ${repr(step)})`
    }
    case "Exp.the": {
      const the = exp
      return `{ ${Ty.repr(the.t)} -- ${repr(the.exp)} }`
    }
  }
}
