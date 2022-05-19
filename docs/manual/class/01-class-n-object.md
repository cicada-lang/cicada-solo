---
title: Class & Object
---

Like most of programming languages,
we use the `class` keyword to define classes.

```cicada
class ABC {
  a: Type
  b: a
  c: String
}
```

After the definition, `ABC` is a `Type`.

```cicada
check ABC: Type
```

Note that, the field `b` depends on the expression `a` from previous fields,
this is called **dependent record type**,

A class is like a sigma type (_dependent pair type_),
while a very important difference is that the names of fields are significant.

For example, the following class has similar field types as `ABC`,
but since it has different field names, it is not the same type as `ABC`.

```cicada
class DEF {
  d: Type
  e: d
  f: String
}
```

We can use `{ ... }` to construct **objects** of a class.

- Note that, when using `{ ... }` to construct objects, the commas between fields is required,
  while when using `class { ... }` to construct classes, the commas are optional.

```cicada
let my_abc: ABC = {
  a: Trivial,
  b: sole,
  c: "c",
}
```

We can get the fields of an object by the **dot notation**.

```cicada
check my_abc.a: Type
check my_abc.b: Trivial
check my_abc.c: String
```

Being a _dependent record type_ means that
the type of a field can depends on
the values of the previous fields.

Here is another `ABC`, note how the type of `b` is different from `my_abc`.

```cicada
let another_abc: ABC = {
  a: String,
  b: "b",
  c: "c",
}

check another_abc.a: Type
check another_abc.b: String
check another_abc.c: String
```

# Extra Fields

An object can has extra fields not specified by the class.

When we claim an object is `ABC`,
as long as the fields specified by the class all pass the type check,
we know our claim is right.

```cicada
let my_abc_with_extra_fields: ABC = {
  a: Trivial,
  b: sole,
  c: "c",
  // extra fields below:
  x: "x",
  y: "y",
  z: "z",
}
```

# Nested Class

A class can be nested.

```cicada
class XYZ {
  x: String,
  y: String,
  z: ABC
}
```

An object can also be nested.

```cicada
let my_xyz: XYZ = {
  x: "x",
  y: "y",
  z: my_abc,
}

compute my_xyz.z
compute my_xyz.z.a
compute my_xyz.z.b
compute my_xyz.z.c
```

# Object Shorthand

If we already defined the name `a`, `b` and `c` as the following,

```cicada
let a = Trivial
let b = sole
let c = "c"
```

Then, instead of repeating the same name twice for each fields,

```cicada
check { a: a, b: b, c: c }: ABC
```

We can use the following shorthand.

```cicada
check { a, b, c }: ABC
```

# Object Spread

Another useful syntax about constructing object is called "spread".

If we have an object with `b` and `c`,

```cicada
let bc: class { b: Trivial, c: String } = {
  b: sole, c: "c"
}
```

We can spread it out using `...bc`.

```cicada
check { a: Trivial, ...bc }: ABC
```
