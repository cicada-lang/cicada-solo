# The Semantic (Constraints) of Judgment

2020-09-29

- Examples:
  link:../cicada/lang1/check.cic
  link:../cicada/lang2/check.cic

- We must always be able to infer the type of logic variable.

- A return type (above the line) can introduce new logic variables.
  and argument types can use them.
  - Although during application of data constructor,
    the direction of data flow is reversed.
    - i.e. argument types match pattern variables,
      and return value use them.

- The argument types can also introduce new logic variables.
  and later argument types can use them.
  - i.e. in judgment, every type can introduce new logic variables.

- all non-reversible patterns, can not occur in type,
  - computation that are not simply data constructor application.
  - examples: `Exp.evaluate`, `Closure.apply`
  and, they must be placed in `@where` block,
  with extra definitional equivalent relation.
  - equivalent relation in the language -- `=`,
    must always be pure pattern matching.
    - how about syntax for record?
      should we use json syntax, instead of `=`?
