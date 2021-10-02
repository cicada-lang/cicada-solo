import { freshen } from "./freshen"
import * as ut from "./index"

ut.assertEqual("x1", freshen(new Set(["x"]), "x"))
ut.assertEqual("x2", freshen(new Set(["x", "x1"]), "x"))
ut.assertEqual("x3", freshen(new Set(["x", "x1", "x2"]), "x"))
