import { Exp, AlphaReprOpts } from "../exp"
import { Ctx } from "../ctx"
import { Env } from "../env"
import * as Value from "../value"
import { Inferable } from "../inferable"
import * as Explain from "../explain"
import * as Trace from "../trace"

export class Var extends Object implements Exp {
  kind = "Var"
  name: string

  constructor(name: string) {
    super()
    this.name = name
  }

  evaluability({ env }: { env: Env }): Value.Value {
    const result = env.lookup(this.name)
    if (result === undefined) {
      throw new Trace.Trace(Explain.explain_name_undefined(this.name))
    }
    return result
  }

  checkability(t: Value.Value, the: { ctx: Ctx }): void {
    return Inferable({
      inferability: ({ ctx }: { ctx: Ctx }) => {
        const t = ctx.lookup(this.name)
        if (t === undefined) {
          throw new Trace.Trace(Explain.explain_name_undefined(this.name))
        }
        return t
      },
    }).checkability(t, the)
  }

  inferability({ ctx }: { ctx: Ctx }): Value.Value {
    const t = ctx.lookup(this.name)
    if (t === undefined) {
      throw new Trace.Trace(Explain.explain_name_undefined(this.name))
    }
    return t
  }

  repr(): string {
    return this.name
  }

  alpha_repr(opts: AlphaReprOpts): string {
    const depth = opts.depths.get(this.name)
    if (depth === undefined) return this.name
    return `[${depth}]`
  }
}
