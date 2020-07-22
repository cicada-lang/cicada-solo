import * as Exp from "../exp"
import * as Ty from "../ty"
import * as ut from "../../ut"

export function repr(exp: Exp.Exp): string {
  switch (exp.kind) {
    case "Exp.Var": {
      return exp.name
    }
    case "Exp.Fn": {
      return `(${exp.name}) => ${repr(exp.body)}`
    }
    case "Exp.Ap": {
      return `${repr(exp.target)}(${repr(exp.arg)})`
    }
    case "Exp.Suite": {
      const def_reprs = exp.defs.map((def) => `${def.name} = ${repr(def.exp)}`)
      const suite_repr = [...def_reprs, repr(exp.body)].join("\n")
      return `{\n${ut.indent(suite_repr, "  ")}\n}`
    }
    case "Exp.Zero": {
      return `zero`
    }
    case "Exp.Add1": {
      return `add1(${repr(exp.prev)})`
    }
    case "Exp.Rec": {
      const { t, target, base, step } = exp
      return `rec[${Ty.repr(t)}](${repr(target)}, ${repr(base)}, ${repr(step)})`
    }
    case "Exp.The": {
      const the = exp
      return `${repr(the.exp)}: ${Ty.repr(the.t)}`
    }
  }
}
