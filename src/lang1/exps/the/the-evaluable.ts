import { Evaluable } from "../../evaluable"
import { evaluate } from "../../evaluate"
import { Exp } from "../../exp"
import * as Ty from "../../ty"

export const the_evaluable = (t: Ty.Ty, exp: Exp) =>
  Evaluable({
    evaluability: ({ env }) => evaluate(env, exp),
  })
