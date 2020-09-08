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
  - compare our syntax with the traditional syntax of writing inference rules:
    - it (the traditional syntax) uses concrete syntax ambiguously.
    - it does not use closure.
    - it uses natural deduction instead of sequent calculus.
    - it use declarative pattern like the `(syntax-rules)` of scheme.
      - to express common collection like list and map.
    - it use mutable variables.
    - it is not purely declarative.
    - it is like the DSL for specifying grammar by grammar rules.

## 模块系统

- module 并非 first class value。
  - 运行时没有 module 的概念。

- 每个文件开头要有 `@module <module-path>`。
  - 其中 `<module-path>` 是 `<part>.<part>.<part>` 的结构，
    比如 `structure.category`。
  - module 的树装结构与文件在文件系统中的位置无关。
    构建过程会搜索所有文件，然后根据 `@module` 组装 module 的树装结构。
  - 引用 module 之后，
    `.` 中缀，只用来取 module 中的名字，
    不用来取 object 的 field。

- 只能 `@import` 数据类型。不能 `@import` 函数。
  - 同时由于我们还规定了，定义 binding 的时候要以数据类型为前缀，
    所以某个文件的 `@module` 可以只写前缀而不需要写数据类型。
    - 比如 `datatype/map/map.cic` 可以只写 `@module datatype`，
      而不需要写 `@module datatype.Map`。
  - 并且同一个 module 中的 binding，
    即使被分散到了不同文件中，
    也可以相互递归引用。
