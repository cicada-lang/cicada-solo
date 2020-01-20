import * as Exp from "./exp"
import * as Value from "./value"
import { evaluate } from "./evaluate"

export class Env {
  constructor(
    public entry_map: Map<string, EnvEntry> = new Map(),
  ) {}

  lookup_type_and_value(name: string): { t: Value.Value, value: Value.Value } | undefined {
    let entry = this.entry_map.get(name)
    if (entry !== undefined) {
      if (entry instanceof EnvEntryRecursiveDefine) {
        let { t, value, env } = entry
        return {
          t: evaluate(env.ext_recursive(name, t, value, env), t),
          value: evaluate(env.ext_recursive(name, t, value, env), value),
        }
      } else if (entry instanceof EnvEntryDefine) {
        let { t, value } = entry
        return { t, value }
      } else {
        throw new Error(
          "Env.lookup_type_and_value fail" +
            `unhandled class of EnvEntry: ${entry.constructor.name}`)
      }
    } else {
      return undefined
    }
  }

  lookup_type(name: string): Value.Value | undefined {
    let result = this.lookup_type_and_value(name)
    if (result !== undefined) {
      let { t } = result
      return t
    } else {
      return undefined
    }
  }

  lookup_value(name: string): Value.Value | undefined {
    let result = this.lookup_type_and_value(name)
    if (result !== undefined) {
      let { value } = result
      return value
    } else {
      return undefined
    }
  }

  ext(name: string, t: Value.Value, value: Value.Value): Env {
    return new Env(new Map([
      ...this.entry_map,
      [name, new EnvEntryDefine(t, value)],
    ]))
  }

  ext_recursive(name: string, t: Exp.Exp, value: Exp.Exp, env: Env): Env {
    return new Env(new Map([
      ...this.entry_map,
      [name, new EnvEntryRecursiveDefine(t, value, env)],
    ]))
  }
}

export abstract class EnvEntry {}

export class EnvEntryRecursiveDefine extends EnvEntry {
  constructor(
    public t: Exp.Exp,
    public value: Exp.Exp,
    public env: Env,
  ) { super() }
}

export class EnvEntryDefine extends EnvEntry {
  constructor(
    public t: Value.Value,
    public value: Value.Value,
  ) { super() }
}
