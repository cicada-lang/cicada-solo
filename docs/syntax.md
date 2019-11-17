# Syntax

## Syntax of expression

| Expression | Example                                        |
|------------|------------------------------------------------|
| pi type    | `(x : t) -> body[x]`, `forall(x : t) -> body[x]` |
| function   | `(x : t) => body[x]`                            |
| sigma type | `exists(x : t, ..., body[x, ...])`              |
| tuple      | `tuple(x, ..., z)`                             |

## Gentzen style

| Expression | Example                              |
|------------|--------------------------------------|
| pi type    | `{ x : t --- body[x] }`               |
| function   | `{ x : t --- body[x] }`               |
| sigma type | `exists { x : t, ..., body[x, ...] }` |
| record     | `record { x = a, ..., z = c }`       |
| tuple      | `tuple(x, ..., z)`                   |
