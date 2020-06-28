import * as Exp from "../exp"

export class Trace {
  previous: Array<Exp.Exp> = new Array()

  constructor(public message: string) {}
}

export * from "./trace-repr"
