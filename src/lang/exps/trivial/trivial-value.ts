import { Core } from "../../core"
import { Ctx } from "../../ctx"
import * as Exps from "../../exps"
import { ReadbackEtaExpansion, Value } from "../../value"

export class TrivialValue
  extends Exps.GlobalValue
  implements ReadbackEtaExpansion
{
  name = "Trivial"
  arity = 0

  constructor(arg_value_entries: Array<Exps.ArgValueEntry> = []) {
    super(arg_value_entries)
  }

  readback_eta_expansion(ctx: Ctx, value: Value): Core {
    // NOTE the η-rule for trivial states that
    //   all of its inhabitants are the same as sole.
    //   This is implemented by reading the all back as sole.
    return new Exps.GlobalCore("sole")
  }

  curry(arg_value_entry: Exps.ArgValueEntry): Exps.GlobalValue {
    return new TrivialValue([...this.arg_value_entries, arg_value_entry])
  }

  // NOTE `Type`
  self_type(): Value {
    return new Exps.TypeValue()
  }
}
