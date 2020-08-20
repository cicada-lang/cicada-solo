import * as Exp from "../exp"
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
      const def_reprs = exp.defs.map((def) => `${def.name} = ${repr(def.exp)}`)
      const suite_repr = [...def_reprs, repr(exp.ret)].join("\n")
      return `{\n${ut.indent(suite_repr, "  ")}\n}`
    }
  }
}
