# Polish vs Reverse Polish Notation

2020-10-31

We should use Polish Notation instead of Reverse Polish Notation (like in Forth).

Because in Polish Notation we can use
the following indentation to format nested expressions:

```
+ * a b
  * + c d
    + e f
```

While in Reverse Polish Notation the indentation will be:

```
f e +
d c + *
  b a * +
```

In Polish Notation the indentation is easier to edit,
because we (English user) are used to write from left to right.
