---
title: Simulating the Sigma type by hand
---

This example is found in [an issue of the-little-typer/pie](https://github.com/the-little-typer/pie/issues/42)

# Simulating the Sigma type in Pie

``` scheme
(claim my-cons
  (Π ((A U)
       (B (-> A U))
       (x A)(y (B x))
       (E U)
       (f (Π ((x A)) (-> (B x) E))))
      E))

(define my-cons
  (lambda (A B x y)
    (lambda (E f) (f x y))))


(claim my-car
  (Π ((A U)
       (B (-> A U))
       (p (Π ((E U)(f (-> A (B x) E))) E)))
      A))

(define my-car
  (lambda (A B p)
    (p A (lambda (a b) a))))


(claim my-car1
  (Π ((A U)
       (B (-> A U))
       (p (Π ((E U)(f (Π ((x A)) (-> (B x) E)))) E)))
      A))

(define my-car1
  (lambda (A B p)
    (p A (lambda (a b) a))))
```

# Simulating the Sigma type in Cicada

``` cicada
my_cons(
  A: Type,
  B: (A) -> Type,
  x: A, y: B(x),
  E: Type,
  f: (x: A, B(x)) -> E,
): E {
  f(x, y)
}

// my_car(
//   A: Type,
//   B: (A) -> Type,
//   p: (E: Type, f: (A, B(x)) -> E) -> E // The name `x` is undefined.
// ): A {
//   (A, B, p) => p(A, (a, b) => a)
// }

my_car1(
  A: Type,
  B: (A) -> Type,
  p: (E: Type, f: (x: A, B(x)) -> E) -> E
): A {
  p(A, (a, b) => a)
}
```
