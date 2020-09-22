import * as Env from "../env"
import * as Mod from "../mod"
import * as Exp from "../exp"
import * as Value from "../value"
import { Obj } from "../../ut"

export type Present = Obj<any> | Array<any> | string

export function present(value: Value.Value): Present {
  switch (value.kind) {
    case "Value.fn": {
      const {
        ret_cl: { name, exp },
      } = value
      return { $fn: [name, Exp.present(exp)] }
    }
    case "Value.str": {
      return value.value
    }
    case "Value.pattern": {
      return { $pattern: `${value.label}:${value.value.toString()}` }
    }
    case "Value.grammar": {
      throw new Error()
    }
  }
}
