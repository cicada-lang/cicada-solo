# cicada

## 语法

- 用 `@` 来做语法关键词的前缀，使得语法关键词 scalable。

- `@datatype` 与 `@judgment` 同义。

- 定义 函数 与 类型 的时候也加上 module 前缀。
  - 这样可以做到，怎么定义就怎么用。
  - 定义 `@datatype` 与 `@judgment` 时，不用在其内部给构造子加 module 前缀。

- reversed-inference-rule style function application syntax.
  - normal:
    ``` cicada
    f(a: A): T
    g(f(a: A): T, b: B): R
    ```
  - reversed-inference-rule style:
    ``` cicada
    T
    ~~~~ f
    A
    ~~~~ a

    R
    ~~~~ g
    { T
      ~~~~ f
      A
      ~~~~ a }
    { B
      ~~~~ b }
    ```

## 模块系统

- 只能 `@import` 数据类型。不能 `@import` 函数。

- module 并非 first class value。
  - 因此 module 名数据类型名字相同时，可以两用。

- `.` 中缀，只用来取 module 中的名字，不用来取 object 的 field。
