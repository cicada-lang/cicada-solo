import { Env } from "./env"
import * as Exp from "./exp"
import { Scope } from "./scope"

export abstract class Value {}

export class Type extends Value {}

export class StrType extends Value {}

export class Str extends Value {
  constructor(
    public str: string,
  ) { super() }
}

export class Pi extends Value {
  constructor(
    public scope: Scope,
    public return_type: Exp.Exp,
    public env: Env,
  ) { super() }
}

export class Fn extends Value {
  constructor(
    public scope: Scope,
    public return_value: Exp.Exp,
    public env: Env,
  ) { super() }
}

export class FnCase extends Value {
  constructor(
    public cases: Array<Fn>,
  ) { super() }
}

export class Cl extends Value {
  constructor(
    public scope: Scope,
    public env: Env,
  ) { super() }
}

export class Obj extends Value {
  constructor(
    public value_map: Map<string, Value>
  ) { super() }
}

export namespace Neutral {

  export abstract class Neutral extends Value {}

  export class Var extends Neutral {
    constructor(
      public name: string,
    ) { super() }
  }

  export class Ap extends Neutral {
    constructor(
      public target: Neutral,
      public args: Array<Value>,
    ) { super() }
  }

  export class Dot extends Neutral {
    constructor(
      public target: Neutral,
      public field: string,
    ) { super() }
  }

}
