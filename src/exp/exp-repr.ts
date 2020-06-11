import * as Exp from "../exp"

export function repr(exp: Exp.Exp): string {
  switch (exp.kind) {
    case Exp.Kind.Var: {
      return exp.name
    }
    case Exp.Kind.Fn: {
      return `(lambda (${exp.name}) ${repr(exp.body)})`
    }
  }
}
