import * as Exp from "../exp"
import * as ut from "../../ut"

{
  const x: Exp.Var = {
    kind: "Exp.Var",
    name: "x",
  }

  ut.assert_equal(Exp.repr(x), "x")
}

{
  const fn: Exp.Fn = {
    kind: "Exp.Fn",
    name: "x",
    body: {
      kind: "Exp.Var",
      name: "x",
    },
  }

  ut.assert_equal(Exp.repr(fn), "(x) => x")
}

{
  const ap: Exp.Ap = {
    kind: "Exp.Ap",
    rator: {
      kind: "Exp.Var",
      name: "f",
    },
    rand: {
      kind: "Exp.Var",
      name: "x",
    },
  }

  ut.assert_equal(Exp.repr(ap), "f(x)")
}
