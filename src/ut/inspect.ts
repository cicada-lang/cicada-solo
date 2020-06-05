import util from "util"

export function inspect(x: any): string {
  return util.inspect(x, false, null, true)
}
