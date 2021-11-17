import { Value } from "../../value"

export abstract class ApHandler {
  abstract apply(arg: Value): Value
}
