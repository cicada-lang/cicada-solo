export type De<T> = {
  lit: (n: number) => T
  neg: (x: T) => T
  add: (x: T, y: T) => T
}

function tf1<T>(de: De<T>): T {
  return de.add(de.lit(8), de.neg(de.add(de.lit(1), de.lit(2))))
}

const number_de = {
  lit: (n: number) => n,
  neg: (x: number) => -x,
  add: (x: number, y: number) => x + y,
}

const string_de = {
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
