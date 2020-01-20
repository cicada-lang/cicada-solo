import { Env } from "./env"
import { Exp } from "./exp"
import { Scope } from "./scope"

export abstract class Value {}

export class ValueType extends Value {}

export class ValueStrType extends Value {}

export class ValueStr extends Value {
  constructor(
    public str: string,
  ) { super() }
}

export class ValuePi extends Value {
  constructor(
    public scope: Scope,
    public return_type: Exp,
    public env: Env,
  ) { super() }
}

export class ValueFn extends Value {
  constructor(
    public scope: Scope,
    public return_value: Exp,
    public env: Env,
  ) { super() }
}

export class ValueFnCase extends Value {
  constructor(
    public cases: Array<ValueFn>,
  ) { super() }
}

export class ValueCl extends Value {
  constructor(
    public scope: Scope,
    public env: Env,
  ) { super() }
}

export class ValueObj extends Value {
  constructor(
    public value_map: Map<string, Value>
  ) { super() }
}

export abstract class Neutral extends Value {}

export class NeutralVar extends Neutral {
  constructor(
    public name: string,
  ) { super() }
}

export class NeutralAp extends Neutral {
  constructor(
    public target: Neutral,
    public args: Array<Value>,
  ) { super() }
}

export class NeutralDot extends Neutral {
  constructor(
    public target: Neutral,
    public field: string,
  ) { super() }
}
