import { Scope } from "./scope"

export abstract class Exp {}

export class Var extends Exp {
  constructor(
    public name: string,
  ) { super() }
}

export class Type extends Exp {}

export class StrType extends Exp {}

export class Str extends Exp {
  constructor(
    public str: string,
  ) { super() }
}

export class Pi extends Exp {
  constructor(
    public scope: Scope,
    public return_type: Exp,
  ) { super() }
}

export class Fn extends Exp {
  constructor(
    public scope: Scope,
    public return_value: Exp,
  ) { super() }
}

export class FnCase extends Exp {
  constructor(
    public cases: Array<Fn>,
  ) { super() }
}

export class Ap extends Exp {
  constructor(
    public target: Exp,
    public args: Array<Exp>,
  ) { super() }
}

export class Cl extends Exp {
  constructor(
    public scope: Scope,
  ) { super() }
}

export class Obj extends Exp {
  constructor(
    public scope: Scope,
  ) { super() }
}

export class Dot extends Exp {
  constructor(
    public target: Exp,
    public field: string,
  ) { super() }
}

export class Block extends Exp {
  constructor(
    public scope: Scope,
    public return_value: Exp,
  ) { super() }
}
