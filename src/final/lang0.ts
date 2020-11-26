export type De<T> = {
  v: (name: string) => T
  fn: (name: string, ret: T) => T
  ap: (target: T, arg: T) => T
}

export type Value = (arg: Value) => Value

export type Env = Map<string, Value>

function extend(env: Env, name: string, value: Value): Env {
  const new_env = new Map(env)
  new_env.set(name, value)
  return new_env
}

const de_value: De<(env: Env) => Value> = {
  v: (name) => (env) => {
    const value = env.get(name)
    if (!value) throw new Error(`Unknown name: ${name}`)
    return value
  },
  fn: (name, ret) => (env) => (arg) => ret(extend(env, name, arg)),
  ap: (target, arg) => (env) => target(env)(arg(env)),
}
