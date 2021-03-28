# About three levels of function programming

- 有些人说他用到 function programming 只用到 algebraic datatype
  按照 computation and deduction
  - (1) algebraic datatype -- abstract syntax tree and evaluation
  - (2) dependent type -- judgment and inference rule -- evaluation in logic style
  - (3) Category theory -- relation between introduction rule and elimination rule -- inversion rule
  - 其中 (2) 是适合在已有的 dependent type 语言中做的，但是 (3) 不适合。
    不论如何我们都要用我们自己的语言来说实现 (2) 而不用已有的语言，
    这并不难，就像 LF 一样。
