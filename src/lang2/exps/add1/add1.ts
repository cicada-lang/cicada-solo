import { Exp } from "../../exp"
import { Evaluable } from "../../evaluable"
import { Checkable } from "../../checkable"
import { Inferable } from "../../inferable"
import { evaluate } from "../../evaluate"
import { check } from "../../check"
import * as Value from "../../value"
import { Repr } from "../../repr"
import { AlphaRepr } from "../../alpha-repr"
import { nat_to_number } from "../../exp"

export type Add1 = Exp & {
    kind: "Exp.add1"
    prev: Exp
  }

export function Add1(prev: Exp): Add1 {
  return {
    kind: "Exp.add1",
    prev,
    evaluability: ({ env }) => Value.add1(evaluate(env, prev)),
    ...Inferable({
      inferability: ({ ctx }) => {
        check(ctx, prev, Value.nat)
        return Value.nat
      },
    }),
    repr() {
      const n = nat_to_number(this)
      if (n !== undefined) {
        return n.toString()
      } else {
        return `add1(${prev.repr()})`
      }
    },
    alpha_repr(opts) {
      const n = nat_to_number(this)
      if (n !== undefined) {
        return n.toString()
      } else {
        return `add1(${prev.alpha_repr(opts)})`
      }
    },
  }
}
