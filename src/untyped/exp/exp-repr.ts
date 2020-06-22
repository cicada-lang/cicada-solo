import * as Exp from "../exp"
import * as ut from "../../ut"

export function repr(exp: Exp.Exp): string {
  switch (exp.kind) {
    case Exp.Kind.Var: {
      return exp.name
    }
    case Exp.Kind.Fn: {
      return `(${exp.name}) => ${repr(exp.body)}`
    }
    case Exp.Kind.Ap: {
      return `${repr(exp.rator)}(${repr(exp.rand)})`
    }
    case Exp.Kind.Suite: {
      let s = exp.defs
        .map((def) => `${def.name} = ${repr(def.exp)}`)
        .join("\n")
      s += "\n"
      s += repr(exp.body)
      s += "\n"
      s += ut.indent(s, "  ")
      return `{\n${s}}`
    }
  }
}
