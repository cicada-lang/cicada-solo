import { Nat } from "./nat"
import * as ut from "../../../ut"

ut.assert_equal(Nat.create(7).even_p(), false)
ut.assert_equal(Nat.create(8).even_p(), true)
