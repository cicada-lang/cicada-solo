import * as Exp from "../exp"
import * as ut from "../../ut"

{
  const args = [Exp.str("-"), Exp.str(">"), Exp.v("y")]
  const exp = Exp.ap(Exp.v("x"), args)

  ut.assert_equal(Exp.repr(exp), 'x("-" ">" y)')
}
