# Syntax

## Syntax of expression

| expression | example                                         |
|------------|-------------------------------------------------|
| pi type    | `(x: t) -> body[x]`, `forall (x: t) -> body[x]` |
| function   | `(x: t) => body[x]`                             |
| sigma type | `(x: t) * body[x]`, `exists (x: t) * body[x]`   |
| pair       | `pair(x, y)`                                    |
