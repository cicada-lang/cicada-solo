import * as ut from "../../ut"

export type De<T> = {
  lit: (n: number) => T
  neg: (x: T) => T
  add: (x: T, y: T) => T
}

// NOTE This means we can have both initial and final encoding.
// - just like `from_present` we can define `from_initial`.
// - to extend this term builder we normalize the present,
//   and add one more level of abstraction.

function from_present<T>(de: De<T>, present: ut.Json): T {
  present = ut.assert_json_object(present)
  if (present["$lit"]) return de.lit(ut.assert_json_number(present["$lit"]))
  if (present["$neg"]) return de.neg(from_present(de, present["$neg"]))
  if (present["$add"]) {
    const args = ut.assert_json_array(present["$add"])
    return de.add(from_present(de, args[0]), from_present(de, args[1]))
  }
  throw new Error(`Unknown present: ${ut.inspect(present)}`)
}

// NOTE Abstraction over recursive application.
type Builder<T> = (recur: Builder<T>, present: ut.Json) => T

function de_builders<T>(de: De<T>): ut.Obj<Builder<T>> {
  return {
    $lit: (recur: Builder<T>, data: ut.Json) =>
      de.lit(ut.assert_json_number(data)),
    $neg: (recur: Builder<T>, data: ut.Json) => de.neg(recur(recur, data)),
    $add: (recur: Builder<T>, data: ut.Json) => {
      const args = ut.assert_json_array(data)
      return de.add(recur(recur, args[0]), recur(recur, args[1]))
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

function tf1<T>(de: De<T>): T {
  // return de.add(de.lit(8), de.neg(de.add(de.lit(1), de.lit(2))))
  // return from_present(de, {
  //   $add: [{ $lit: 8 }, { $neg: { $add: [{ $lit: 1 }, { $lit: 2 }] } }],
  // })
  return lets_build(de_builders(de))({
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

const number_de: De<number> = {
  lit: (n: number) => n,
  neg: (x: number) => -x,
  add: (x: number, y: number) => x + y,
}

const string_de: De<string> = {
  lit: (n: number) => `${n}`,
  neg: (x: string) => `(-${x})`,
  add: (x: string, y: string) => `(${x}+${y})`,
}

console.log(tf1(number_de))
console.log(tf1(string_de))

function tfl1<T>(de: De<T>): Array<T> {
  return [de.lit(1), de.add(de.lit(1), de.lit(3))]
}

console.log(tfl1(number_de))
console.log(tfl1(string_de))

export type DeMul<T> = {
  mul: (x: T, y: T) => T
}

function de_mul_builders<T>(de: DeMul<T>): ut.Obj<Builder<T>> {
  return {
    $mul: (recur: Builder<T>, data: ut.Json) => {
      const args = ut.assert_json_array(data)
      return de.mul(recur(recur, args[0]), recur(recur, args[1]))
    },
  }
}

function tfm1<T>(de: De<T> & DeMul<T>): T {
  // return de.mul(de.lit(7), de.neg(de.mul(de.lit(1), de.lit(2))))
  return lets_build({
    ...de_builders(de),
    ...de_mul_builders(de),
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

function tfm2<T>(de: De<T> & DeMul<T>): T {
  return de.mul(de.lit(7), tf1(de))
}

const number_de_mul: DeMul<number> = {
  mul: (x: number, y: number) => x * y,
}

const string_de_mul: DeMul<string> = {
  mul: (x: string, y: string) => `(${x}*${y})`,
}

console.log(tfm1({ ...number_de, ...number_de_mul }))
console.log(tfm1({ ...string_de, ...string_de_mul }))

console.log(tfm2({ ...number_de, ...number_de_mul }))
console.log(tfm2({ ...string_de, ...string_de_mul }))
