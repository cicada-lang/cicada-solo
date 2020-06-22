import * as Exp from "../exp"
import * as ut from "../../ut"

const sentences = [
  "x",
  "f(x)",
  "(x) => f(x)",
  "(f) => (x) => x",
  "(f) => (x) => f(x)",
  "(f) => (x) => f(f(x))",
  "(f) => (x) => f(f(f(x)))",
  "(f) => (x) => f(f(f(f(x))))",
  "(f) => (x) => f(x)(x)(x)",
  `(f) => (x) => {
  y = x
  f(y)
}`,
]

for (const sentence of sentences) {
  const exp = Exp.parse(sentence)
  const repr = Exp.repr(exp)
  ut.assert_equal(sentence, repr)
}
