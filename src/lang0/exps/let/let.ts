import { Exp } from "../../exp"
import { Evaluable } from "../../evaluable"
import { evaluate } from "../../evaluate"
import * as Env from "../../env"

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
        evaluate(Env.extend(env, name, evaluate(env, exp)), ret),
    }),
    repr: () => `@let ${name} = ${exp.repr()}\n${ret.repr()}`,
  }
}
