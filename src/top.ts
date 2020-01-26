import * as Exp from "./exp"

export abstract class Top {}

export class TopLet extends Top {
  constructor(
    public name: string,
    public exp: Exp.Exp,
  ) { super() }
}

export class TopDefine extends Top {
  constructor(
    public name: string,
    public t: Exp.Exp,
    public exp: Exp.Exp,
  ) { super() }
}

export class TopKeywordRefuse extends Top {
  constructor(
    public exp: Exp.Exp,
    public t: Exp.Exp,
  ) { super() }
}

export class TopKeywordAccept extends Top {
  constructor(
    public exp: Exp.Exp,
    public t: Exp.Exp,
  ) { super() }
}

export class TopKeywordShow extends Top {
  constructor(
    public exp: Exp.Exp,
  ) { super() }
}

export class TopKeywordEq extends Top {
  constructor(
    public rhs: Exp.Exp,
    public lhs: Exp.Exp,
  ) { super() }
}
