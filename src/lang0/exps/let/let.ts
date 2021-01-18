import { Exp } from "../../exp"
import { Evaluable } from "../../evaluable"
import { evaluate } from "../../evaluate"

export type Let = Exp & {
  kind: "Let"
  name: string
  exp: Exp
  ret: Exp
}

export function Let(name: string, exp: Exp, ret: Exp): Let {
  return {
    kind: "Let",
    name,
    exp,
    ret,
    ...Evaluable({
      evaluability: ({ env }) =>
        evaluate(env.extend(name, evaluate(env, exp)), ret),
    }),
    repr: () => `@let ${name} = ${exp.repr()}\n${ret.repr()}`,
  }
}
