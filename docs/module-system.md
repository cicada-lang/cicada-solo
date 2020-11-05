# 模块系统

- 约束：
  - 模块与文件系统无关，用 @module 挂载文件到 module tree 中。
  - 同一个 module 中的元素可以相互引用。
  - 每个 @datatype 有伴随的 module，在其中可以引用其上级 module 中的元素。
  - module 为 first class value，用 record type 处理其类型。
  - 需要区分 public 与 private 元素。

- use graph theory to as model to describe the semantic of module system.
  - use the tree model of file system as warm up.
    ``` cicada
    FileSystem.exist_p(fs: FileSystem, path: List(String)): Boolean
    FileSystem.file_p(fs: FileSystem, path: List(String)): Boolean
    FileSystem.file_read(fs: FileSystem, path: List(String)): String
    FileSystem.directory_p(fs: FileSystem, path: List(String)): Boolean
    FileSystem.directory_list(fs: FileSystem, path: List(String)): List(String)
    FileSystem.directory_list_deep(fs: FileSystem, path: List(String)): List(List(String))
    ```
    only file has `String` as content,
    directory can not have `String` as content.
    ``` cicada
    @datatype Node {
      file: (content: String) -> Node
      directory: (children: Map(String, Node)) -> Node
    }
    ```
  - for the design of our module system, we can first do something like `FileSystem`.
    - module -- file
    - namespace -- directory
    可以尝试这种区分 `@module` 与 `@namespace` 的设计，看看能不能满足所有需求。

- 每个文件开头要有 `@module <module-path>`。
  - 其中 `<module-path>` 是 `<part>.<part>.<part>` 的结构，
    比如 `structure.category`。
  - module 的树装结构与文件在文件系统中的位置无关。
    构建过程会搜索所有文件，然后根据 `@module` 组装 module 的树装结构。
  - 引用 module 之后， `.` 中缀，既用来取 module 中的名字，也用来取 object 的 field。

- 只能 `@import` 数据类型。不能 `@import` 函数。
  - 同时由于我们还规定了，定义 binding 的时候要以数据类型为前缀，
    所以某个文件的 `@module` 可以只写前缀而不需要写数据类型。
    - 比如 `datatype/map/map.cic` 可以只写 `@module datatype`，
      而不需要写 `@module datatype.Map`。
  - 并且同一个 module 中的 binding，
    即使被分散到了不同文件中，
    也可以相互递归引用。

- 同一个模块中的不同文件之间可以相互调用，不再需要 import，比如 `@module lang2`。
  因此可以用带有 `@module lang2` 的 `dependencies.cic` 文件，
  来集中 import （用 `@export` 来 re-export）所有依赖。
