import * as Exp from "../exp"
import * as ut from "../../ut"

{
  const x: Exp.v = {
    kind: "Exp.v",
    name: "x",
  }

  ut.assert_equal(Exp.repr(x), "x")
}

{
  const fn: Exp.fn = {
    kind: "Exp.fn",
    name: "x",
    body: {
      kind: "Exp.v",
      name: "x",
    },
  }

  ut.assert_equal(Exp.repr(fn), "(x) => x")
}

{
  const ap: Exp.ap = {
    kind: "Exp.ap",
    target: {
      kind: "Exp.v",
      name: "f",
    },
    arg: {
      kind: "Exp.v",
      name: "x",
    },
  }

  ut.assert_equal(Exp.repr(ap), "f(x)")
}
