# note
- we need nominal typing
  - because of zero and null and so on
  - we need nominal typing to express our intension
- we can have both fulfilling type system and nominal typing
  - use fulfilling type only for class, keep data simple
- we can have both nominal typing and record (like object of js)
  - `Class { ... }` as object constructor
  - `{ ... }` as record like object
# todo
- equation test
- fix comments about inference rules
- note about `Neutral.The` and the value
- [maybe] we should learn from pie again
  - make tartlet a pie and test by the little typer
# cicada
- [equality] we can implementation equality by built-in equality
  maybe we need to built-in (make it an axiom) the following function
  ``` cicada
  transport : {
    equation : equation_t(A, x, y)
    motive : { x : A -> type }
    base : motive(x)
    -> motive(y)
  } = {
    equation : equation_t(A, x, y)
    motive : { x : A -> type }
    base : motive(x)
    => base
  }
  ```
- [test] define `category_t` as algebraic structure
- [test] define  `contextual_pre_category_t` as algebraic structure
- mutual recursive definition only at top level
- [module system] not so hurry, after the core is stable
# error report
- add span to `Exp`
- color output
# learn from gradual type system
- how they refine type in a `if` block?
# js backend
- a simple compiler to translate the semantics of `evaluate` to js
# note
- [maybe] [top] we need a framework for adding new keywords
  - a little bit early to do this now
- [note] we can also use `new` to construct object from class
  - but I choose to use `{}` syntax to construct all objects for now
- [maybe] should we handle `A : type` specially?
  - I think no.
