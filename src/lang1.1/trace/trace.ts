import * as Exp from "../exp"

export class Trace<T> {
  previous: Array<T> = new Array()

  constructor(public message: string) {}
}
