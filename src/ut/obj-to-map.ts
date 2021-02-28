import * as ut from "@/ut"

export function obj_to_map<A>(obj: ut.Obj<A>): Map<string, A> {
  const map = new Map()
  for (const [k, v] of Object.entries(obj)) {
    map.set(k, v)
  }
  return map
}
