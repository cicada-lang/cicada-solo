import { assertEqual } from "./assert-equal"
import { freshen } from "./freshen"

assertEqual("x1", freshen(new Set(["x"]), "x"))
assertEqual("x2", freshen(new Set(["x", "x1"]), "x"))
assertEqual("x3", freshen(new Set(["x", "x1", "x2"]), "x"))
