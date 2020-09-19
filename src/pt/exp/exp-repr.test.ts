import * as Exp from "../exp"
import * as ut from "../../ut"

{
  const main = Exp.v("y")
  const args = [Exp.str("-"), Exp.str(">"), main]
  const exp = Exp.ap(Exp.v("x"), args, main)

  ut.assert_equal(Exp.repr(exp), 'x("-" ">" y)')
}
