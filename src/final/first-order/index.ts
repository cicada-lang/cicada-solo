import * as ut from "../../ut"

export type Lit<T> = { lit: (n: number) => T }
export type Neg<T> = { neg: (x: T) => T }
export type Add<T> = { add: (x: T, y: T) => T }

export type Lang0<T> = Lit<T> & Neg<T> & Add<T>

// NOTE This means we can have both initial and final encoding.
// - just like `from_present` we can define `from_initial`.
// - to extend this term builder we normalize the present,
//   and add one more level of abstraction.

function from_present<T>(the: Lang0<T>, present: ut.Json): T {
  present = ut.assert_json_object(present)
  if (present["$lit"]) return the.lit(ut.assert_json_number(present["$lit"]))
  if (present["$neg"]) return the.neg(from_present(the, present["$neg"]))
  if (present["$add"]) {
    const args = ut.assert_json_array(present["$add"])
    return the.add(from_present(the, args[0]), from_present(the, args[1]))
  }
  throw new Error(`Unknown present: ${ut.inspect(present)}`)
}

// NOTE Abstraction over recursive application.
type Builder<T> = (recur: Builder<T>, present: ut.Json) => T

function lang_builders<T>(the: Lang0<T>): ut.Obj<Builder<T>> {
  return {
    $lit: (recur: Builder<T>, data: ut.Json) =>
      the.lit(ut.assert_json_number(data)),
    $neg: (recur: Builder<T>, data: ut.Json) => the.neg(recur(recur, data)),
    $add: (recur: Builder<T>, data: ut.Json) => {
      const args = ut.assert_json_array(data)
      return the.add(recur(recur, args[0]), recur(recur, args[1]))
    },
  }
}

function lets_build<T>(builders: ut.Obj<Builder<T>>): (present: ut.Json) => T {
  function united(recur: Builder<T>, present: ut.Json): T {
    present = ut.assert_json_object(present)
    for (const [key, builder] of Object.entries(builders)) {
      if (present[key]) {
        return builder(united, present[key])
      }
    }
    throw new Error(`Unknown present: ${ut.inspect(present)}`)
  }

  // NOTE This application of `united` to itself is the key.
  // - I do not fully understand this.
  // - To understand this, we should read:
  //   - "Diagonalization and Self-Reference"
  //     by Raymond Smullyan
  return (present) => united(united, present)
}

function tf1<T>(the: Lang0<T>): T {
  // return the.add(the.lit(8), the.neg(the.add(the.lit(1), the.lit(2))))
  // return from_present(the, {
  //   $add: [{ $lit: 8 }, { $neg: { $add: [{ $lit: 1 }, { $lit: 2 }] } }],
  // })
  return lets_build(lang_builders(the))({
    $add: [
      { $lit: 8 },
      {
        $neg: {
          $add: [{ $lit: 1 }, { $lit: 2 }],
        },
      },
    ],
  })
}

const number_of_lang0: Lang0<number> = {
  lit: (n: number) => n,
  neg: (x: number) => -x,
  add: (x: number, y: number) => x + y,
}

const string_of_lang0: Lang0<string> = {
  lit: (n: number) => `${n}`,
  neg: (x: string) => `(-${x})`,
  add: (x: string, y: string) => `(${x}+${y})`,
}

console.log(tf1(number_of_lang0))
console.log(tf1(string_of_lang0))

function tfl1<T>(the: Lang0<T>): Array<T> {
  return [the.lit(1), the.add(the.lit(1), the.lit(3))]
}

console.log(tfl1(number_of_lang0))
console.log(tfl1(string_of_lang0))

export type Mul<T> = {
  mul: (x: T, y: T) => T
}

function mul_builders<T>(the: Mul<T>): ut.Obj<Builder<T>> {
  return {
    $mul: (recur: Builder<T>, data: ut.Json) => {
      const args = ut.assert_json_array(data)
      return the.mul(recur(recur, args[0]), recur(recur, args[1]))
    },
  }
}

function tfm1<T>(the: Lang0<T> & Mul<T>): T {
  // return the.mul(the.lit(7), the.neg(the.mul(the.lit(1), the.lit(2))))
  return lets_build({
    ...lang_builders(the),
    ...mul_builders(the),
  })({
    $mul: [
      { $lit: 7 },
      {
        $neg: {
          $mul: [{ $lit: 1 }, { $lit: 2 }],
        },
      },
    ],
  })
}

function tfm2<T>(the: Lang0<T> & Mul<T>): T {
  return the.mul(the.lit(7), tf1(the))
}

const number_of_mul: Mul<number> = {
  mul: (x: number, y: number) => x * y,
}

const string_of_mul: Mul<string> = {
  mul: (x: string, y: string) => `(${x}*${y})`,
}

console.log(tfm1({ ...number_of_lang0, ...number_of_mul }))
console.log(tfm1({ ...string_of_lang0, ...string_of_mul }))

console.log(tfm2({ ...number_of_lang0, ...number_of_mul }))
console.log(tfm2({ ...string_of_lang0, ...string_of_mul }))
