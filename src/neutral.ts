import * as Exp from "./exp"
import * as Value from "./value"
import { Env } from "./env"
import { Scope } from "./scope"

export abstract class Neutral extends Value.Value {}

export class Var extends Neutral {
  constructor(
    public name: string,
  ) { super() }
}

export class Ap extends Neutral {
  constructor(
    public target: Neutral,
    public args: Array<Value.Value>,
  ) { super() }
}

export class Dot extends Neutral {
  constructor(
    public target: Neutral,
    public field: string,
  ) { super() }
}
