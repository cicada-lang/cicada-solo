import * as Exp from "../exp"

export class Trace {
  previous: Array<Exp.Exp> = new Array()

  constructor(
    public last: Exp.Exp,
    public message: string
  ) {}
}
