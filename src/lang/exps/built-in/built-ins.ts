import * as Exps from "../../exps"

// NOTE A built-in name can be redefined at top level, or in local scope.

class Globals {
  values: Map<string, Exps.GlobalValue>

  constructor(values: Map<string, Exps.GlobalValue> = new Map()) {
    this.values = values
  }

  findValue(name: string): Exps.GlobalValue | undefined {
    return this.values.get(name)
  }

  register(value: Exps.GlobalValue): this {
    const found = this.findValue(value.name)
    if (found !== undefined) {
      throw new Error(
        `I can not re-register built-in value of name: ${value.name}`
      )
    }

    this.values.set(value.name, value)
    return this
  }
}

export const globals = new Globals()
  .register(new Exps.TheValue([]))
  .register(new Exps.TodoValue([]))
  .register(new Exps.TodoNoteValue([]))
  .register(new Exps.PairValue([]))
  .register(new Exps.BothValue([]))
  .register(new Exps.EqualValue())
  .register(new Exps.ReflValue())
  .register(new Exps.SameValue())
  .register(new Exps.TheSameValue())
  .register(new Exps.ReplaceValue())
  .register(new Exps.StrValue())
  .register(new Exps.TrivialValue())
  .register(new Exps.SoleValue())
  .register(new Exps.AbsurdValue())
  .register(new Exps.FromFalsehoodAnythingValue())
  .register(new Exps.TypeValue())
