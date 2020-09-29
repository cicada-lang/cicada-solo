import * as Mod from "../mod"
import * as mods from "../mods"
import * as ut from "../../ut"

function test(present: Mod.Present): void {
  ut.assert_equal(present, Mod.present(Mod.build(present)))
}

test(mods.exp)
