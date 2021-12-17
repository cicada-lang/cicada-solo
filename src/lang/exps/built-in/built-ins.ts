import * as Exps from "../../exps"

// NOTE A built-in name can be redefined at top level, or in local scope.

class BuiltIns {
  values: Map<string, Exps.BuiltInValue>

  constructor(values: Map<string, Exps.BuiltInValue> = new Map()) {
    this.values = values
  }

  find_value(name: string): Exps.BuiltInValue | undefined {
    return this.values.get(name)
  }

  register(value: Exps.BuiltInValue): this {
    const found = this.find_value(value.name)
    if (found !== undefined) {
      throw new Error(
        `I can not re-register built-in value of name: ${value.name}`
      )
    }

    this.values.set(value.name, value)
    return this
  }
}

export const built_ins = new BuiltIns()
  .register(new Exps.TheValue([]))
  .register(new Exps.TodoValue([]))
  .register(new Exps.TodoNoteValue([]))
  .register(new Exps.PairValue([]))
  .register(new Exps.EqualValue())
  .register(new Exps.ReflValue())
  .register(new Exps.SameValue())
  .register(new Exps.TheSameValue())
  .register(new Exps.ReplaceValue())
  .register(new Exps.StrValue())
  .register(new Exps.TrivialValue())
  .register(new Exps.SoleValue())
  .register(new Exps.AbsurdValue())
  .register(new Exps.TypeValue())
