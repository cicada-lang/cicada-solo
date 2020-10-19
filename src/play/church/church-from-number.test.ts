import * as church from "../church"
import * as ut from "../../ut"

const zero = church.from_number(0)
const one = church.from_number(1)
const two = church.from_number(2)
const three = church.from_number(3)

ut.assert_equal(church.to_number(zero), 0)
ut.assert_equal(church.to_number(one), 1)
ut.assert_equal(church.to_number(two), 2)
ut.assert_equal(church.to_number(three), 3)
