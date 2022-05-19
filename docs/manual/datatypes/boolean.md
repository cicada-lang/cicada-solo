---
title: Boolean
---

# Boolean

```cicada
datatype Boolean {
  true: Boolean
  false: Boolean
}

let true = Boolean.true
let false = Boolean.false
```

# not

```cicada
function not(x: Boolean): Boolean {
  return recursion (x) {
    case true => false
    case false => true
  }
}
```

```cicada
same_as_chart (Boolean) [
  false,
  not(true),
  not(not(false)),
]
```

# and

```cicada
function and(x: Boolean, y: Boolean): Boolean {
  return recursion (x) {
    case true => recursion (y) {
      case true => true
      case false => false
    }
    case false => recursion (y) {
      case true => false
      case false => false
    }
  }
}
```

```cicada
same_as_chart (Boolean) [
  and(true, true),
  true,
]

same_as_chart (Boolean) [
  and(true, false),
  and(false, true),
  and(false, false),
  false,
]
```

# or

```
Boolean.or(x: Boolean, y: Boolean): Boolean
Boolean.or(Boolean.true, Boolean.true) = Boolean.true
Boolean.or(Boolean.true, Boolean.false) = Boolean.true
Boolean.or(Boolean.false, Boolean.true) = Boolean.true
Boolean.or(Boolean.false, Boolean.false) = Boolean.false
```
