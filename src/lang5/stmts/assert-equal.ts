import { Stmt } from "../stmt"
import { World } from "../world"
import { value_equal } from "../value"
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
      const left_value_stack = left.jos_execute(world).value_stack
      const right_value_stack = right.jos_execute(world).value_stack

      if (left_value_stack.mark !== right_value_stack.mark) {
        throw new Error(
          ut.aline(`
            |ValueStack mark mismatch.
            |- left_value_stack: ${left_value_stack.repr().trim()}
            |- right_value_stack: ${right_value_stack.repr().trim()}
            |`)
        )
      }

      if (left_value_stack.values.length !== right_value_stack.values.length) {
        throw new Error(
          ut.aline(`
            |ValueStack values.length mismatch.
            |- left_value_stack: ${left_value_stack.repr().trim()}
            |- right_value_stack: ${right_value_stack.repr().trim()}
            |`)
        )
      }

      const zipped = ut.zip(left_value_stack.values, right_value_stack.values)
      for (const [left_value, right_value] of zipped) {
        if (!value_equal(left_value, right_value)) {
          throw new Error(
            ut.aline(`
              |[assert_equal fail]
              |- left_value: ${left_value.repr()}
              |- right_value: ${right_value.repr()}
              |`)
          )
        }
      }

      return world
    },
  }
}
