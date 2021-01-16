import { Stmt } from "../stmt"
import { World } from "../world"
import { value_equal } from "../value"
import { JoJoValue } from "../values"
import { JoJo } from "../jos/jojo"
import * as ut from "../../ut"

export type AssertNotEqual = Stmt & {
  left: JoJo
  right: JoJo
}

export function AssertNotEqual(left: JoJo, right: JoJo): AssertNotEqual {
  return {
    left,
    right,
    execute: (world) => {
      if (value_equal(JoJoValue(left, world), JoJoValue(right, world))) {
        throw new Error(
          ut.aline(`
            |[assert_not_equal fail]
            |TODO
            |`)
        )
      } else {
        return world
      }
    },
  }
}
