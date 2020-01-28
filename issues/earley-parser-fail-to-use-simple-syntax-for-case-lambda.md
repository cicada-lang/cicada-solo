# earley parser fail to use simple syntax for case lambda

I wished to use the following syntax:

``` scala
nat_add : { x : nat_t, y : nat_t -> nat_t } = {
  case x : succ_t, y : nat_t => succ(nat_add(x.prev, y))
  case x : zero_t, y : nat_t => y
}
```

but I have to add `choice` as head,
otherwise earley parser can not handle it.

``` scala
nat_add : { x : nat_t, y : nat_t -> nat_t } = choice {
  case x : succ_t, y : nat_t => succ(nat_add(x.prev, y))
  case x : zero_t, y : nat_t => y
}
```
