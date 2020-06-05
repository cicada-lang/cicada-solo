import * as Exp from "./exp"
import * as Env from "./env"
import * as Scope from "./scope"
import * as Neutral from "./neutral"

export abstract class Value {
  abstract_class_name: "Value" = "Value"
}

export class Type extends Value {}

export class StrType extends Value {}

export class Str extends Value {
  constructor(public str: string) {
    super()
  }
}

export class Pi extends Value {
  constructor(
    public scope: Scope.Scope,
    public return_type: Exp.Exp,
    public scope_env: Env.Env
  ) {
    super()
  }
}

export class Fn extends Value {
  constructor(
    public scope: Scope.Scope,
    public body: Exp.Exp,
    public scope_env: Env.Env
  ) {
    super()
  }
}

export class FnCase extends Value {
  constructor(public cases: Array<Fn>) {
    super()
  }
}

export class Cl extends Value {
  constructor(
    public defined: Map<string, { t: Value; value: Value }>,
    public scope: Scope.Scope,
    public scope_env: Env.Env
  ) {
    super()
  }
}

export class Obj extends Value {
  constructor(public defined: Map<string, { t: Value; value: Value }>) {
    super()
  }
}

export class Equation extends Value {
  constructor(
    public t: Value,
    public lhs: Exp.Exp,
    public rhs: Exp.Exp,
    public equation_env: Env.Env
  ) {
    super()
  }
}

export class Same extends Value {
  constructor(public t: Value, public value: Value) {
    super()
  }
}

export class TheNeutral extends Value {
  constructor(public t: Value, public value: Neutral.Neutral) {
    super()
  }
}
