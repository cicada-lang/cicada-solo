// We are able to use markup to pick up parts,
// and ignore other parts during collection.
// The named parts will be pick up into the resulting object.

exp {
  var -> (name: identifier)
  fn -> "(" (name: identifier) ")" "=>" (body: exp)
  ap -> (head: identifier) (tail: one_or_more("(" x ")"))
}

one_or_more(x) {
  one -> (value: x)
  more -> (head: x) (tail: one_or_more(x))
}

// A function can only take one argument.
// - terminal -- "(" & ")" , does not count as argument.
// - non-terminal -- x, consts as argument.
// - use currying to handle multiple arguments.

one_or_more("(" x ")")

// The namings in one_or_more(x) ignore all terminals.

one_or_more {
  one -> "(" (value: x) ")"
  more -> "(" (head: x) ")" (tail: one_or_more("(" x ")"))
}


// Example tree, in which
// `name` and `kind` properties
// give us ATD-like data.

{
  name: one_or_more
  kind: more
  value: {
    head: "f"
    tail: {
      ...
    }
  }
}
