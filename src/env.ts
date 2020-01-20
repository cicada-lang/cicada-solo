import { Exp } from "./exp"
import { Value } from "./value"
import { evaluate } from "./evaluate"

export class Env {
  constructor(
    public entry_map: Map<string, EnvEntry> = new Map(),
  ) {}

  lookup_type_and_value(name: string): [ Value, Value ] | undefined {
    let entry = this.entry_map.get(name)
    if (entry !== undefined) {
      if (entry instanceof EnvEntryRecursiveDefine) {
        let { t, value, env } = entry
        return [ evaluate(env.ext_recursive(name, t, value, env), t),
                 evaluate(env.ext_recursive(name, t, value, env), value) ]
        throw new Error("TODO")
      } else if (entry instanceof EnvEntryDefine) {
        return [ entry.t, entry.value ]
      } else {
        throw new Error("TODO")
      }
    } else {
      return undefined
    }
  }

  //   def lookup_type(name: string): Option[Value] {
  //     lookup_type_and_value(name).map {
  //       case (t, _value) => t
  //     }
  //   }

  //   def lookup_value(name: string): Option[Value] {
  //     lookup_type_and_value(name).map {
  //       case (_t, value) => value
  //     }
  //   }

  //   def ext(name: string, t: Value, value: Value): Env {
  //     Env(this.entry_map + (name -> EnvEntryDefine(t, value)))
  //   }

  ext_recursive(name: string, t: Exp, value: Exp, env: Env): Env {
    throw new Error("TODO")
    // return new Env(this.entry_map + (name -> EnvEntryRecursiveDefine(t, value, env)))
  }

}

export abstract class EnvEntry {}

export class EnvEntryRecursiveDefine extends EnvEntry {
  constructor(
    public t: Exp,
    public value: Exp,
    public env: Env,
  ) { super() }
}

export class EnvEntryDefine extends EnvEntry {
  constructor(
    public t: Value,
    public value: Value,
  ) { super() }
}
