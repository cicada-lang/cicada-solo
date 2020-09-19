import * as Sym from "../sym"
import * as ut from "../../ut"

{
  const main = Sym.v("y")
  const args = [Sym.str("-"), Sym.str(">"), main]
  const sym = Sym.ap(Sym.v("x"), args, main)

  ut.assert_equal(Sym.repr(sym), 'x("-" ">" y)')
}
