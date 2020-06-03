import * as Exp from "./exp"
import * as Value from "./value"
import * as Err from "./err"
import { evaluate } from "./evaluate"

export class Env {
  constructor(public entry_map: Map<string, Entry.Entry> = new Map()) {}

  lookup_type_and_value(
    name: string
  ): undefined | { t: Value.Value; value: Value.Value } {
    let entry = this.entry_map.get(name)

    if (entry === undefined) {
      return undefined
    } else if (entry instanceof Entry.DefineRec) {
      let { t, value, env } = entry
      return {
        t: evaluate(env.ext_rec(name, { t, value, env }), t),
        value: evaluate(env.ext_rec(name, { t, value, env }), value),
      }
    } else if (entry instanceof Entry.Define) {
      let { t, value } = entry
      return { t, value }
    } else {
      throw new Err.Unhandled(entry)
    }
  }

  lookup_type(name: string): undefined | Value.Value {
    let result = this.lookup_type_and_value(name)

    if (result === undefined) {
      return undefined
    } else {
      let { t } = result
      return t
    }
  }

  lookup_value(name: string): undefined | Value.Value {
    let result = this.lookup_type_and_value(name)

    if (result === undefined) {
      return undefined
    } else {
      let { value } = result
      return value
    }
  }

  ext(
    name: string,
    the: {
      t: Value.Value
      value: Value.Value
    }
  ): Env {
    return new Env(
      new Map([...this.entry_map, [name, new Entry.Define(the.t, the.value)]])
    )
  }

  ext_rec(
    name: string,
    the: {
      t: Exp.Exp
      value: Exp.Exp
      env: Env
    }
  ): Env {
    return new Env(
      new Map([
        ...this.entry_map,
        [name, new Entry.DefineRec(the.t, the.value, the.env)],
      ])
    )
  }
}

export namespace Entry {
  export abstract class Entry {
    abstract_class_name: "Env.Entry" = "Env.Entry"
  }

  export class DefineRec extends Entry {
    constructor(public t: Exp.Exp, public value: Exp.Exp, public env: Env) {
      super()
    }
  }

  export class Define extends Entry {
    constructor(public t: Value.Value, public value: Value.Value) {
      super()
    }
  }
}
