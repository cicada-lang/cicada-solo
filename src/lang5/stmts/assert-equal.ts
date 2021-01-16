import { Stmt } from "../stmt"
import { World } from "../world"
import { value_equal } from "../value"
import { JoJoValue } from "../values"
import { JoJo } from "../jos/jojo"
import * as ut from "../../ut"

export type AssertEqual = Stmt & {
  left: JoJo
  right: JoJo
}

export function AssertEqual(left: JoJo, right: JoJo): AssertEqual {
  return {
    left,
    right,
    execute: (world) => {
      if (value_equal(JoJoValue(left, world), JoJoValue(right, world))) {
        return world
      } else {
        throw new Error(
          ut.aline(`
            |[assert_equal fail]
            |TODO
            |`)
        )
      }
    },
  }
}
