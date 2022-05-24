---
title: Univalent Axiom
---

# Id

```cicada
datatype Id(T: Type) (from: T, to: T) {
  refl(vague x: T): Id(T, x, x)
}
```

```cicada
compute Id.refl
check Id.refl: Id(String, "a", "a")
```

# J

```cicada
function J(
  implicit T: Type,
  motive: (from: T, to: T, target: Id(T, from, to)) -> Type,
  base: (x: T) -> motive(x, x, Id.refl),
  implicit x: T,
  implicit y: T,
  id: Id(T, x, y)
): motive(x, y, id) {
  return induction (id) {
    motive (from, to, target) => motive(from, to, target)
    case refl(vague z) => base(z)
  }
}
```
