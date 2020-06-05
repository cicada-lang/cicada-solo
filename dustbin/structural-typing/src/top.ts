import * as Exp from "./exp"
import * as Scope from "./scope"

export abstract class Top {
  abstract_class_name: "Top" = "Top"
}

export class TopNamedScopeEntry extends Top {
  constructor(public name: string, public entry: Scope.Entry.Entry) {
    super()
  }
}

export class TopKeywordRefuse extends Top {
  constructor(public exp: Exp.Exp, public t: Exp.Exp) {
    super()
  }
}

export class TopKeywordAccept extends Top {
  constructor(public exp: Exp.Exp, public t: Exp.Exp) {
    super()
  }
}

export class TopKeywordShow extends Top {
  constructor(public exp: Exp.Exp) {
    super()
  }
}

export class TopKeywordEq extends Top {
  constructor(public lhs: Exp.Exp, public rhs: Exp.Exp) {
    super()
  }
}
