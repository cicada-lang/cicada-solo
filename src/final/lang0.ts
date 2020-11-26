export type V<T> = { v: (name: string) => T }
export type Fn<T> = { fn: (name: string, ret: T) => T }
export type Ap<T> = { ap: (target: T, arg: T) => T }

export type Lang0<T> = V<T> & Fn<T> & Ap<T>

export type Value = (arg: Value) => Value

export type Env = Map<string, Value>

function extend(env: Env, name: string, value: Value): Env {
  const new_env = new Map(env)
  new_env.set(name, value)
  return new_env
}

function get_unwrap(env: Env, name: string): Value {
  const value = env.get(name)
  if (!value) throw new Error(`Unknown name: ${name}`)
  return value
}

const value_of: Lang0<(env: Env) => Value> = {
  v: (name) => (env) => get_unwrap(env, name),
  fn: (name, ret) => (env) => (arg) => ret(extend(env, name, arg)),
  ap: (target, arg) => (env) => target(env)(arg(env)),
}
