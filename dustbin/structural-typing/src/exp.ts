import * as Scope from "./scope"

export abstract class Exp {
  abstract_class_name: "Exp" = "Exp"
}

export class Var extends Exp {
  constructor(public name: string) {
    super()
  }
}

export class Type extends Exp {}

export class StrType extends Exp {}

export class Str extends Exp {
  constructor(public str: string) {
    super()
  }
}

export class Pi extends Exp {
  constructor(public scope: Scope.Scope, public return_type: Exp) {
    super()
  }
}

export class Fn extends Exp {
  constructor(public scope: Scope.Scope, public body: Exp) {
    super()
  }
}

export class FnCase extends Exp {
  constructor(public cases: Array<Fn>) {
    super()
  }
}

export class Ap extends Exp {
  constructor(public target: Exp, public args: Array<Exp>) {
    super()
  }
}

export class Cl extends Exp {
  constructor(public scope: Scope.Scope) {
    super()
  }
}

export class Obj extends Exp {
  constructor(public scope: Scope.Scope) {
    super()
  }
}

export class Dot extends Exp {
  constructor(public target: Exp, public field_name: string) {
    super()
  }
}

export class Block extends Exp {
  constructor(public scope: Scope.Scope, public body: Exp) {
    super()
  }
}

export class The extends Exp {
  constructor(public t: Exp, public value: Exp) {
    super()
  }
}

export class Equation extends Exp {
  constructor(public t: Exp, public lhs: Exp, public rhs: Exp) {
    super()
  }
}

export class Same extends Exp {
  constructor(public t: Exp, public value: Exp) {
    super()
  }
}

export class Transport extends Exp {
  constructor(public equation: Exp, public motive: Exp, public base: Exp) {
    super()
  }
}
