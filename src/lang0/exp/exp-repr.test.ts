import * as Exp from "../exp"
import * as ut from "../../ut"

const x = Exp.v("x")
ut.assert_equal(Exp.repr(x), "x")

const fn = Exp.fn("x", Exp.v("x"))
ut.assert_equal(Exp.repr(fn), "(x) => x")

const ap = Exp.ap(Exp.v("f"), Exp.v("x"))
ut.assert_equal(Exp.repr(ap), "f(x)")
