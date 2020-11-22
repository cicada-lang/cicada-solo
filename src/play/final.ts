import * as ut from "../ut"

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

type Parser<T> = (parse: Parser<T>, present: ut.Json) => T

function de_parser_dict<T>(de: De<T>): ut.Obj<Parser<T>> {
  return {
    $lit: (parse: Parser<T>, data: ut.Json) =>
      de.lit(ut.assert_json_number(data)),
    $neg: (parse: Parser<T>, data: ut.Json) => de.neg(parse(parse, data)),
    $add: (parse: Parser<T>, data: ut.Json) => {
      const args = ut.assert_json_array(data)
      return de.add(parse(parse, args[0]), parse(parse, args[1]))
    },
  }
}

function gen_parse<T>(parser_dict: ut.Obj<Parser<T>>): (present: ut.Json) => T {
  function the_parser(parser: Parser<T>, present: ut.Json): T {
    present = ut.assert_json_object(present)
    for (const [key, parser] of Object.entries(parser_dict)) {
      if (present[key]) {
        return parser(the_parser, present[key])
      }
    }
    throw new Error(`Unknown present: ${ut.inspect(present)}`)
  }
  return (present) => the_parser(the_parser, present)
}

function tf1<T>(de: De<T>): T {
  // return de.add(de.lit(8), de.neg(de.add(de.lit(1), de.lit(2))))
  // return from_present(de, {
  //   $add: [{ $lit: 8 }, { $neg: { $add: [{ $lit: 1 }, { $lit: 2 }] } }],
  // })
  return gen_parse(de_parser_dict(de))({
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

function de_mul_parser_dict<T>(de: DeMul<T>): ut.Obj<Parser<T>> {
  return {
    $mul: (parse: Parser<T>, data: ut.Json) => {
      const args = ut.assert_json_array(data)
      return de.mul(parse(parse, args[0]), parse(parse, args[1]))
    },
  }
}

function tfm1<T>(de: De<T> & DeMul<T>): T {
  // return de.mul(de.lit(7), de.neg(de.mul(de.lit(1), de.lit(2))))
  return gen_parse({
    ...de_parser_dict(de),
    ...de_mul_parser_dict(de),
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
