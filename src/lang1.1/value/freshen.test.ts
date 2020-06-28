import { freshen } from "./freshen"
import * as ut from "../../ut"

ut.assert_equal("x_1", freshen(new Set("x"), "x"))
