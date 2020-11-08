# Parsing Techniques

## grammar

We are able to use markup to pick up parts,
and ignore other parts during collection.
The named parts will be pick up into the resulting object.

```
exp = {
  exp:var -> (name: identifier)
  exp:fn -> "(" (name: identifier) ")" "=" ">" (body: exp)
  exp:ap -> (head: identifier) (tail: one_or_more("(" exp ")"))
}
```

## fn

```
one_or_more(x) = {
  one_or_more:one -> (value: x)
  one_or_more:more -> (head: x) (tail: one_or_more(x))
}
```

## ap

A function can only take one argument.
- terminal -- "(" & ")" , does not count as argument.
- non-terminal (such as x) count as argument.
- use currying to handle multiple arguments.
- function application should always bind name to array of args.

The namings in one_or_more(x) ignore all terminals.

```
one_or_more("(" x ")")
```

```
{
  one_or_more:one -> "(" (value: x) ")"
  one_or_more:more -> "(" (head: x) ")" (tail: one_or_more("(" x ")"))
}
```

## parse tree

A parse tree is a graph that shows how a sentence is derived by some CFG.

Example parse tree, in which `name` and `kind` properties give us ADT-like data.

Our syntax for CFG can be viewed as decorated ADT,
ADT decorated by terminals and ignored non-terminals.

```
{
  name: one_or_more,
  kind: one,
  body: {
    value: "f"
  }
}

{
  name: one_or_more,
  kind: more,
  body: {
    head: "f",
    tail: {
      name: one_or_more,
      kind: more,
      body: {
        head: "f",
        tail: {
          name: one_or_more,
          kind: one,
          body: {
            value: "f"
          }
        }
      }
    }
  }
}
```
