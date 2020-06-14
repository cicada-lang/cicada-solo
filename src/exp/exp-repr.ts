import * as Exp from "../exp"

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
  }
}
