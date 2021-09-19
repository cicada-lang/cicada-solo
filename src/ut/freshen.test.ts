import { freshen } from "./freshen"
import * as ut from "./index"

ut.assert_equal("x1", freshen(new Set(["x"]), "x"))
ut.assert_equal("x2", freshen(new Set(["x", "x1"]), "x"))
ut.assert_equal("x3", freshen(new Set(["x", "x1", "x2"]), "x"))
