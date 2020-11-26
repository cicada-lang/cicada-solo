import * as ut from "../../ut"
import { $, _ } from "../../hkts"

export type De<Fun> = {
  num: <Env>(x: number) => $<Fun, [Env, number]>
  add: <Env>(
    x: $<Fun, [Env, number]>,
    y: $<Fun, [Env, number]>
  ) => $<Fun, [Env, number]>

  zi: <Env, A>() => $<Fun, [[A, Env], A]>
  si: <Env, A, B>(prev: $<Fun, [Env, B]>) => $<Fun, [[A, Env], B]>

  fn: <Env, A, B>(ret: $<Fun, [[A, Env], B]>) => $<Fun, [Env, (x: A) => B]>
  ap: <Env, A, B>(
    target: $<Fun, [Env, (x: A) => B]>,
    arg: $<Fun, [Env, A]>
  ) => $<Fun, [Env, B]>
}
