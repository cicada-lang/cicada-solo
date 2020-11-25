import { $, _ } from "../hkts"

export type Lang0<Exp> = {
  v: Exp
  fn: (name: string, ret: Exp) => Exp
  ap: (target: Exp, arg: Exp) => Exp
}
