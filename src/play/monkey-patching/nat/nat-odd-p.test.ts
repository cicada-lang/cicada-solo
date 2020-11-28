import { Nat } from "."
import * as ut from "../../../ut"

ut.assert_equal(Nat.create(7).odd_p(), true)
ut.assert_equal(Nat.create(8).odd_p(), false)
