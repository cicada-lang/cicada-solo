import { freshen_name } from "./freshen-name"
import * as ut from "./index"

ut.assert_equal("x1", freshen_name(new Set(["x"]), "x"))
ut.assert_equal("x2", freshen_name(new Set(["x", "x1"]), "x"))
ut.assert_equal("x3", freshen_name(new Set(["x", "x1", "x2"]), "x"))
