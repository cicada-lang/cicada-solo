import * as Exp from "../exp"
import * as ut from "../../ut"

{
  const x: Exp.Var = {
    kind: Exp.Kind.Var,
    name: "x",
  }

  ut.assert_equal(Exp.repr(x), "x")
}

{
  const fn: Exp.Fn = {
    kind: Exp.Kind.Fn,
    name: "x",
    body: {
      kind: Exp.Kind.Var,
      name: "x",
    },
  }

  ut.assert_equal(Exp.repr(fn), "(x) => x")
}

{
  const ap: Exp.Ap = {
    kind: Exp.Kind.Ap,
    rator: {
      kind: Exp.Kind.Var,
      name: "f",
    },
    rand: {
      kind: Exp.Kind.Var,
      name: "x",
    },
  }

  ut.assert_equal(Exp.repr(ap), "f(x)")
}
