import * as Exp from "../exp"
import * as ut from "../../ut"

{
  const exp = Exp.ap(
    Exp.v("x"),
    [Exp.lit("-"), Exp.lit(">"), Exp.v("y")],
    Exp.v("y")
  )
  ut.assert_equal(Exp.repr(exp), 'x("-" ">" y)')
}
