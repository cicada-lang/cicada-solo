import { freshen_name } from "./freshen-name"
import * as ut from "./index"

ut.assert_equal("x_1", freshen_name(new Set("x"), "x"))
