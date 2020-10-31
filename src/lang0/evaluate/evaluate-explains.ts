import * as ut from "../../ut"

export function explain_name_undefined(name: string): string {
  const explanation = `
    |The name ${name} is undefined.
    |`
  return ut.aline(explanation)
}
