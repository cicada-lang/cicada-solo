import { Exp } from "../../exp"
import { Env } from "../../env"
import { Readbackable } from "../../readbackable"
import { readback } from "../../readback"
import { do_ap } from "../../evaluate"
import * as ut from "../../../ut"
import { Fn } from "../fn"
import { VarNeutral } from "../var-neutral"
import { NotYetValue } from "../not-yet-value"

export type FnValue = Readbackable & {
  kind: "FnValue"
  name: string
  ret: Exp
  env: Env
}

export function FnValue(name: string, ret: Exp, env: Env): FnValue {
  return {
    kind: "FnValue",
    name,
    ret,
    env,
    ...Readbackable({
      readbackability({ used }) {
        const fresh_name = ut.freshen_name(used, name)
        const v = NotYetValue(VarNeutral(fresh_name))
        const ret_value = do_ap(FnValue(name, ret, env), v)
        return Fn(
          fresh_name,
          readback(new Set([...used, fresh_name]), ret_value)
        )
      },
    }),
  }
}
