# reversed-inference-rule style function application syntax

- normal:
  ``` cicada
  f(a: A): T
  g(f(a: A): T, b: B): R
  ```

- reversed-inference-rule style:
  ``` cicada
  T
  ---- f
  A
  ---- a

  R
  ---- g
  { T
    ---- f
    A
    ---- a }
  { B
    ---- b }
  ```

- compare our syntax with the traditional syntax of writing inference rules:
  - it (the traditional syntax) uses concrete syntax ambiguously.
  - it does not use closure.
  - it uses natural deduction instead of sequent calculus.
  - it use declarative pattern like the `(syntax-rules)` of scheme.
    - to express common collection like list and map.
  - it use mutable variables.
  - it is not purely declarative.
  - it is like the DSL for specifying grammar by grammar rules.
