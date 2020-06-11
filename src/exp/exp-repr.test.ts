import * as Exp from "../exp"

const fn: Exp.Fn = {
  kind: Exp.Kind.Fn,
  name: "x",
  body: {
    kind: Exp.Kind.Var,
    name: "x",
  }
}

console.log(Exp.repr(fn))
