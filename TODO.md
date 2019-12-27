# party
- good error report for earley
  like: https://github.com/kach/nearley/issues/451
- rename party to partech
- handle top list by simple parser first
# cicada
- fix parsing error
- [example] vector_length
- [example] vector_append
- we also take this opportunity to handle currying
  - just push value to env and return new `ValueFn`
  - also need to change `infer`
- `the`
- [equality] we can implementation equality by built-in equality
  maybe we need to built-in (make it an axiom) the following function
  ``` cicada
  function transport {
    suppose A : type
    suppose x, y : A
    given equation : equation_t(A, x, y)
    given motive : { given x : A conclude type }
    given value : motive(x)
    conclude motive(y)
    return value
  }
  ```
- [test] define `category_t` as algebraic structure
- [test] define  `contextual_pre_category_t` as algebraic structure
- mutual recursive definition only at top level
- [module system] not so hurry, after the core is stable
# js backend
- a simple compiler to translate the semantics of `eval` to js
# docs
- [semantics] use the concept of **free variable proof** to explain the semantics of cicada
  (traditional type theoretical semantics)
# note
- [maybe] [top] we need a framework for adding new keywords
  - a little bit early to do this now
- [note] we can also use `new` to construct object from class
  - but I choose to use `{}` syntax to construct all objects for now
- [maybe] `Exp`
- [maybe] should we handle `A : type` specially?
  - I think no.
