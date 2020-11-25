import { $, _ } from "../hkts"

interface Functor<T> {
  map: <A, B>(f: (x: A) => B, t: $<T, [A]>) => $<T, [B]>
}

type Maybe<A> = { tag: "none" } | { tag: "some"; value: A }
const none: Maybe<never> = { tag: "none" }
const some = <A>(value: A): Maybe<A> => ({ tag: "some", value })

const maybe_functor: Functor<Maybe<_>> = {
  map: (f, maybe) => (maybe.tag === "none" ? none : some(f(maybe.value))),
}

console.log(maybe_functor.map((n) => n + 1, some(42)))
