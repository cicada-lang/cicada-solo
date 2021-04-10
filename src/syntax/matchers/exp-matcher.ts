import pt from "@cicada-lang/partech"
import { Exp } from "../../exp"
import { Var } from "../../core"
import { Pi, Fn, Ap } from "../../core"
import { Sigma, Cons, Car, Cdr } from "../../core"
import { Cls, Ext, Obj, Dot } from "../../core"
import { Nat, Zero, Add1, NatInd } from "../../core"
import { Equal, Same, Replace } from "../../core"
import { Absurd, AbsurdInd } from "../../core"
import { Trivial, Sole } from "../../core"
import { Str, Quote } from "../../core"
import { Type } from "../../core"
import { Let } from "../../core"
import { The } from "../../core"
import { nat_from_number } from "../../core/nat/nat-util"
import * as ut from "../../ut"

function pi_handler(body: { [key: string]: pt.Tree }): Exp {
  const { bindings, ret_t } = body
  let result = exp_matcher(ret_t)
  for (const { names, exp } of bindings_matcher(bindings).reverse()) {
    for (const name of names.reverse()) {
      result = new Pi(name, exp, result)
    }
  }
  return result
}

export function exp_matcher(tree: pt.Tree): Exp {
  return pt.matcher<Exp>({
    "exp:var": ({ name }) => new Var(pt.str(name)),
    "exp:pi": pi_handler,
    "exp:fn": ({ names, ret }) => {
      let result = exp_matcher(ret)
      for (const name of names_matcher(names).reverse()) {
        result = new Fn(name, result)
      }
      return result
    },
    "exp:ap": ({ target, args }) => {
      let result: Exp = new Var(pt.str(target))
      for (const arg of pt.matchers.one_or_more_matcher(args)) {
        for (const exp of exps_matcher(arg)) {
          result = new Ap(result, exp)
        }
      }
      return result
    },
    "exp:sigma": ({ name, car_t, cdr_t }) =>
      new Sigma(pt.str(name), exp_matcher(car_t), exp_matcher(cdr_t)),
    "exp:pair": ({ car_t, cdr_t }) =>
      new Sigma("_", exp_matcher(car_t), exp_matcher(cdr_t)),
    "exp:cons": ({ car, cdr }) => new Cons(exp_matcher(car), exp_matcher(cdr)),
    "exp:car": ({ target }) => new Car(exp_matcher(target)),
    "exp:cdr": ({ target }) => new Cdr(exp_matcher(target)),
    "exp:cls": ({ entries }) =>
      new Cls(pt.matchers.zero_or_more_matcher(entries).map(cls_entry_matcher)),
    "exp:ext": ({ parent_name, entries }) =>
      new Ext(
        pt.str(parent_name),
        pt.matchers.zero_or_more_matcher(entries).map(cls_entry_matcher)
      ),
    "exp:obj": ({ properties }) =>
      new Obj(
        new Map(
          pt.matchers.zero_or_more_matcher(properties).map(property_matcher)
        )
      ),
    "exp:dot_field": ({ target, name }) =>
      new Dot(exp_matcher(target), pt.str(name)),
    "exp:dot_method": ({ target, name, args }) => {
      let result: Exp = new Dot(exp_matcher(target), pt.str(name))
      for (const arg of pt.matchers.one_or_more_matcher(args)) {
        for (const exp of exps_matcher(arg)) {
          result = new Ap(result, exp)
        }
      }
      return result
    },
    "exp:nat": () => new Nat(),
    "exp:zero": () => new Zero(),
    "exp:add1": ({ prev }) => new Add1(exp_matcher(prev)),
    "exp:number": ({ value }, { span }) => {
      const n = Number.parseInt(pt.str(value))
      if (Number.isNaN(n)) {
        throw new pt.ParsingError(
          `Expecting number, instead of: ${ut.inspect(n)}`,
          { span }
        )
      } else {
        return nat_from_number(n)
      }
    },
    "exp:nat_ind": ({ target, motive, base, step }) =>
      new NatInd(
        exp_matcher(target),
        exp_matcher(motive),
        exp_matcher(base),
        exp_matcher(step)
      ),
    "exp:equal": ({ t, from, to }) =>
      new Equal(exp_matcher(t), exp_matcher(from), exp_matcher(to)),
    "exp:same": () => new Same(),
    "exp:replace": ({ target, motive, base }) =>
      new Replace(exp_matcher(target), exp_matcher(motive), exp_matcher(base)),
    "exp:trivial": () => new Trivial(),
    "exp:sole": () => new Sole(),
    "exp:absurd": () => new Absurd(),
    "exp:absurd_ind": ({ target, motive }) =>
      new AbsurdInd(exp_matcher(target), exp_matcher(motive)),
    "exp:str": () => new Str(),
    "exp:quote": ({ value }) => new Quote(pt.trim_boundary(pt.str(value), 1)),
    "exp:type": () => new Type(),
    "exp:let": ({ name, exp, ret }) =>
      new Let(pt.str(name), exp_matcher(exp), exp_matcher(ret)),
    "exp:the": ({ t, exp }) => new The(exp_matcher(t), exp_matcher(exp)),
  })(tree)
}

export function cls_entry_matcher(
  tree: pt.Tree
): { name: string; t: Exp; exp?: Exp } {
  return pt.matcher({
    "cls_entry:field_demanded": ({ name, t }) => ({
      name: pt.str(name),
      t: exp_matcher(t),
    }),
    "cls_entry:field_fulfilled": ({ name, t, exp }) => ({
      name: pt.str(name),
      t: exp_matcher(t),
      exp: exp_matcher(exp),
    }),
    "cls_entry:method_demanded": ({ name, bindings, ret_t }) => ({
      name: pt.str(name),
      t: pi_handler({ bindings, ret_t }),
    }),
    "cls_entry:method_fulfilled": ({ name, bindings, ret_t, ret }) => {
      let fn = exp_matcher(ret)
      for (const { names } of bindings_matcher(bindings).reverse()) {
        for (const name of names.reverse()) {
          fn = new Fn(name, fn)
        }
      }

      return {
        name: pt.str(name),
        t: pi_handler({ bindings, ret_t }),
        exp: fn,
      }
    },
  })(tree)
}

export function bindings_matcher(
  tree: pt.Tree
): Array<{ names: Array<string>; exp: Exp }> {
  return pt.matcher({
    "bindings:bindings": ({ entries, last_entry }) => [
      ...pt.matchers.zero_or_more_matcher(entries).map(binding_entry_matcher),
      binding_entry_matcher(last_entry),
    ],
  })(tree)
}

export function binding_entry_matcher(
  tree: pt.Tree
): { names: Array<string>; exp: Exp } {
  return pt.matcher({
    "binding_entry:nameless": ({ exp }) => ({
      names: ["_"],
      exp: exp_matcher(exp),
    }),
    "binding_entry:named": ({ name, exp }) => ({
      names: [pt.str(name)],
      exp: exp_matcher(exp),
    }),
    "binding_entry:multi_named": ({ names, exp }) => ({
      names: pt.matchers.one_or_more_matcher(names).map(pt.str),
      exp: exp_matcher(exp),
    }),
  })(tree)
}

export function names_matcher(tree: pt.Tree): Array<string> {
  return pt.matcher({
    "names:names": ({ entries, last_entry }) => [
      ...pt.matchers.zero_or_more_matcher(entries).map(pt.str),
      pt.str(last_entry),
    ],
  })(tree)
}

export function exps_matcher(tree: pt.Tree): Array<Exp> {
  return pt.matcher({
    "exps:exps": ({ entries, last_entry }) => [
      ...pt.matchers.zero_or_more_matcher(entries).map(exp_matcher),
      exp_matcher(last_entry),
    ],
  })(tree)
}

export function property_matcher(tree: pt.Tree): [string, Exp] {
  return pt.matcher<[string, Exp]>({
    "property:field": ({ name, exp }) => [pt.str(name), exp_matcher(exp)],
    "property:method": ({ name, bindings, ret_t }) => [
      pt.str(name),
      pi_handler({ bindings, ret_t }),
    ],
  })(tree)
}
