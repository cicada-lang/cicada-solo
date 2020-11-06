import * as Exp from "../exp"
import * as mods from "../mods"
import * as ut from "../../ut"

function test(present: Exp.Present): void {
  ut.assert_equal(present, Exp.present(Exp.from_present(present)))
}

const { identifier, one_or_more, exp } = mods.exp

test(identifier)
test(exp)
test(one_or_more)
