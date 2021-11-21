# pi type with implicit argument and implicit function insertion

``` cicada
let typeof: (implicit T: Type, x: T) -> Type = (implicit T, _) => T
// NOTE The bound variable name of `im-fn` does not matter.
// let typeof2: (implicit T: Type, x: T) -> Type = (implicit A, _) => A
```
