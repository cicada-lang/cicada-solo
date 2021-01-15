import { Stmt } from "../stmt"
import { World } from "../world"
import { value_equal } from "../value"
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
      const left_value_stack = left.jos_execute(world).value_stack
      const right_value_stack = right.jos_execute(world).value_stack

      if (left_value_stack.mark !== right_value_stack.mark) {
        return world
      }

      if (left_value_stack.values.length !== right_value_stack.values.length) {
        return world
      }

      const zipped = ut.zip(left_value_stack.values, right_value_stack.values)
      for (const [left_value, right_value] of zipped) {
        if (!value_equal(left_value, right_value)) {
          return world
        }
      }

      throw new Error(
        ut.aline(`
          |[assert_not_equal fail]
          |- left_value_stack: ${left_value_stack.repr().trim()}
          |- right_value_stack: ${right_value_stack.repr().trim()}
          |`)
      )
    },
  }
}
