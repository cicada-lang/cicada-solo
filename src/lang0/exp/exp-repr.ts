import * as Exp from "../exp"
import * as Stmt from "../stmt"
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
    case "Exp.begin": {
      const s = [...exp.stmts.map(Stmt.repr), repr(exp.ret)].join("\n")
      return `{\n${ut.indent(s, "  ")}\n}`
    }
  }
}
