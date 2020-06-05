export function map2obj<V>(map: Map<string, V>): { [key: string]: V } {
  let obj: { [key: string]: V } = {}
  for (let [k, v] of map.entries()) {
    obj[k] = v
  }
  return obj
}

export function obj2map<V>(obj: { [key: string]: V }): Map<string, V> {
  let map = new Map<string, V>()
  for (let k in obj) {
    map.set(k, obj[k])
  }
  return map
}

export function kvs2map<V>(array: Array<[string, V]>): Map<string, V> {
  let map = new Map()
  for (let [k, v] of array) {
    map.set(k, v)
  }
  return map
}

export function kvs2obj<V>(array: Array<[string, V]>): { [key: string]: V } {
  return map2obj(kvs2map(array))
}

export function map_value<K, A, B>(map: Map<K, A>, f: (a: A) => B): Map<K, B> {
  let new_map = new Map()
  for (let [k, a] of map.entries()) {
    new_map.set(k, f(a))
  }
  return new_map
}
