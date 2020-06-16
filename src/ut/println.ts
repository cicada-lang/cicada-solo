import util from "util"

export function println(x: any): void {
  console.log(util.inspect(x, false, null, true))
}
