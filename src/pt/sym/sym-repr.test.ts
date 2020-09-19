import * as Sym from "../sym"
import * as ut from "../../ut"

{
  const sym = Sym.ap(
    Sym.v("x"),
    [Sym.lit("-"), Sym.lit(">"), Sym.v("y")],
    Sym.v("y")
  )
  ut.assert_equal(Sym.repr(sym), 'x("-" ">" y)')
}
