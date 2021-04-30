import { Neutral } from "../../neutral"
import { Exp } from "../../exp"
import { Ctx } from "../../ctx"
import { Car } from "../../cores"

export class CarNeutral implements Neutral {
  target: Neutral

  constructor(target: Neutral) {
    this.target = target
  }

  readback_neutral(ctx: Ctx): Exp {
    return new Car(this.target.readback_neutral(ctx))
  }
}
