# JavaScript RegExp

- string in `new RegExp("...")` can be dynamic,
  while `/.../` literal can not be dynamic.

- backslash in `new RegExp("...")` is `\\`,
  for example `new RegExp("\\s")`.
  - because js string syntax is interpreting `\`.

- slash in `/.../` is `\/`,
  for example `/^examples\/translate/`.
  can be `new RegExp("^examples/translate")`.

- we use `new RegExp("...")` in "parsing techniques",
  just like how json-schema use it.
  - https://json-schema.org/understanding-json-schema/reference/regular_expressions.html
