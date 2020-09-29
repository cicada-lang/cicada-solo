import * as Value from "../value"

export function terminal_p(value: Value.Value): boolean {
  return value.kind === "Value.str" || value.kind === "Value.pattern"
}
