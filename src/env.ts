import { Exp } from "./exp"
import { Value } from "./value"

export class Env {
  constructor(
    public entry_map: Map<string, EnvEntry> = new Map(),
  ) {}
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
