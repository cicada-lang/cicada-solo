# cicada
- do not allow re-define
- `@accept` as dual of `@refuse`
- `@same` and `@same_type`
- `infer` + subtyping between `ValueCl` and `ValueCl`
  should handle `check` of `Obj` in `ValueCl`
- handle recursive definition
- test tagged union
- [test] some functional programming examples
- we also take this opportunity to handle currying
  - just push value to env and return new `ValueFn`
  - also need to change `infer`
- `the`
- [equality]
  - [built-in] we can implementation equality by built-in equality
    maybe we need to built-in (make it an axiom) the following function
    ``` cicada
    function transport = {
      suppose A : type
      suppose x, y : A
      given equation : equation_t(A, x, y)
      given motive : { given x : A conclude type }
      given motive(x)
      conclude motive(y)
      return base
    }
    ```
- [test] define `category_t` as total algebraic structure
- [test] define `category_t` as partial algebraic structure
# js backend
- a simple compiler to translate the semantics of `eval` to js
# docs
- [semantics] use the concept of **free variable proof** to explain the semantics of cicada
  (traditional type theoretical semantics)
# partech
- clean up partech
- [partech] use exception instead of `Either`
- good error report for earley
  like: https://github.com/kach/nearley/issues/451
- [problem] it would be good to be able to use `rule.ext` to reuse rules
  but this does not handle recursive definitions of rule
  - we may try to reuse hosting language's inheritance
# note
- [maybe] [top] we need a framework for adding new keywords
  - a little bit early to do this now
- [note] we can also use `new` to construct object from class
  - but I choose to use `{}` syntax to construct all objects for now
- [maybe] `Exp`
- [maybe] should we handle `A : type` specially?
  - I think no.
